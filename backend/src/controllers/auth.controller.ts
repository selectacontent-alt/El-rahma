import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  clearAuthCookies,
  createOpaqueToken,
  getCookie,
  getJwtSecret,
  hashToken,
  REFRESH_COOKIE,
  setAuthCookies,
} from '../utils/auth';

const prisma = new PrismaClient();

const loginAttempts = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>();

function checkLoginRate(req: Request) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (record?.lockedUntil && record.lockedUntil > now) {
    return Math.ceil((record.lockedUntil - now) / 1000);
  }
  if (!record || now - record.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.set(key, { count: 0, firstAttempt: now });
  }
  return 0;
}

function recordLoginFailure(req: Request) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, firstAttempt: now };
  record.count += 1;
  if (record.count >= 8) {
    record.lockedUntil = now + 15 * 60 * 1000;
  }
  loginAttempts.set(key, record);
}

function clearLoginFailures(req: Request) {
  loginAttempts.delete(req.ip || 'unknown');
}

function signAccessToken(user: { id: number; username: string; role: string }, sessionId: number) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, sessionId },
    getJwtSecret(),
    { expiresIn: '30m' }
  );
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const retryAfter = checkLoginRate(req);
    if (retryAfter > 0) {
      return res.status(429).json({ message: `Too many login attempts. Try again in ${retryAfter} seconds.` });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.isActive) {
      recordLoginFailure(req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordLoginFailure(req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    clearLoginFailures(req);

    const refreshToken = createOpaqueToken();
    const session = await prisma.adminSession.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashToken(refreshToken),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const safeUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };
    const accessToken = signAccessToken(user, session.id);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ user: safeUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = getCookie(req, REFRESH_COOKIE);
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    const session = await prisma.adminSession.findUnique({
      where: { refreshTokenHash: hashToken(refreshToken) },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt < new Date() || !session.user.isActive) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Invalid session' });
    }

    const nextRefresh = createOpaqueToken();
    await prisma.adminSession.update({
      where: { id: session.id },
      data: { refreshTokenHash: hashToken(nextRefresh), lastUsedAt: new Date() },
    });
    const accessToken = signAccessToken(session.user, session.id);
    setAuthCookies(res, accessToken, nextRefresh);
    res.json({
      user: {
        id: session.user.id,
        username: session.user.username,
        role: session.user.role,
        mustChangePassword: session.user.mustChangePassword,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = getCookie(req, REFRESH_COOKIE);
    if (refreshToken) {
      await prisma.adminSession.updateMany({
        where: { refreshTokenHash: hashToken(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  } catch (error) {
    console.error('Logout session cleanup failed:', error);
  }
  clearAuthCookies(res);
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        lastLoginAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || String(newPassword).length < 10) {
      return res.status(400).json({ message: 'New password must be at least 10 characters' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 12),
        passwordUpdatedAt: new Date(),
        mustChangePassword: false,
      },
    });
    await prisma.adminSession.updateMany({
      where: { userId: user.id, id: { not: req.user?.sessionId || 0 }, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
