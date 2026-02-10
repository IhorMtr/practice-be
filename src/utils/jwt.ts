import * as jwt from 'jsonwebtoken';

import type {
  AccessPayload,
  ExpiresIn,
  RefreshPayload,
} from '../types/index.js';
import { getEnvVar } from './getEnvVar.js';

export function signAccessToken(payload: AccessPayload, expiresIn: ExpiresIn) {
  return jwt.sign(payload, getEnvVar('JWT_ACCESS_SECRET'), { expiresIn });
}

export function signRefreshToken(
  payload: RefreshPayload,
  expiresIn: ExpiresIn,
) {
  return jwt.sign(payload, getEnvVar('JWT_REFRESH_SECRET'), { expiresIn });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, getEnvVar('JWT_ACCESS_SECRET')) as AccessPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, getEnvVar('JWT_REFRESH_SECRET')) as RefreshPayload;
}
