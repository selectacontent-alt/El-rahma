import crypto from 'crypto';
import { Request, Response } from 'express';

export const ACCESS_COOKIE = 'sc_admin_access';
export const REFRESH_COOKIE = 'sc_admin_refresh';

const isProduction = process.env.NODE_ENV === 'production';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'secret' || secret.length < 24) {
    throw new Error('JWT_SECRET must be set to a strong value of at least 24 characters');
  }
  return secret;
}

export function parseCookies(req: Request) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce<Record<string, string>>((acc, item) => {
    const index = item.indexOf('=');
    if (index === -1) return acc;
    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

export function getCookie(req: Request, name: string) {
  return parseCookies(req)[name];
}

export function createOpaqueToken() {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 60 * 1000,
    path: '/',
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookies(res: Response) {
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
  };
  res.clearCookie(ACCESS_COOKIE, options);
  res.clearCookie(REFRESH_COOKIE, options);
}
