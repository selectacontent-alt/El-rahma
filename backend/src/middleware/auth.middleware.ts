import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ACCESS_COOKIE, getCookie, getJwtSecret } from '../utils/auth';

export interface AuthRequest extends Request {
  user?: { id: number; username: string; role: string; sessionId?: number };
}

const prisma = new PrismaClient();

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || getCookie(req, ACCESS_COOKIE);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: number; username: string; role: string; sessionId?: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Inactive or missing user' });
    }
    req.user = { id: user.id, username: user.username, role: user.role, sessionId: decoded.sessionId };
    next();
  } catch (error: any) {
    if (error.message?.includes('JWT_SECRET')) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

export const auditAdminAction = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  const startedAt = Date.now();
  res.on('finish', () => {
    const user = req.user;
    const pathParts = req.path.split('/').filter(Boolean);
    const entity = pathParts[0] || 'admin';
    const entityId = pathParts.find(part => /^\d+$/.test(part));
    const bodyKeys = req.body && typeof req.body === 'object'
      ? Object.keys(req.body).filter(key => !/password|token|secret/i.test(key))
      : [];

    prisma.adminAuditLog.create({
      data: {
        userId: user?.id,
        action: `${req.method} ${req.path}`,
        method: req.method,
        path: req.originalUrl,
        entity,
        entityId,
        statusCode: res.statusCode,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        meta: JSON.stringify({ durationMs: Date.now() - startedAt, bodyKeys }),
      },
    }).catch(error => {
      console.error('Admin audit log failed:', error);
    });
  });

  next();
};
