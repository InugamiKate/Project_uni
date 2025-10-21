import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';

export type JwtAccessPayload = {
  uid: string;
  account_role: string;
  user_role: string | null;
  major_id: string | null;
};

export type JwtRefreshPayload = {
  accountId: string;
};

export function signAccessToken(payload: JwtAccessPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpire });
}

export function signRefreshToken(payload: JwtRefreshPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire });
}

export function verifyAccessToken<T = any>(token: string): T {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as T;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TokenExpired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('InvalidToken');
    }
    throw error;
  }
}

export function verifyRefreshToken<T = any>(token: string): T {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as T;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TokenExpired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('InvalidToken');
    }
    throw error;
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
