import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';

export function signAccessToken(payload: object): string {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpire });
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire });
}

export function verifyAccessToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as T;
  } catch {
    return null;
  }
}

export function verifyRefreshToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as T;
  } catch {
    return null;
  }
}

// tiện ích
export function decodeAccessToken(token: string): any | null {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}
