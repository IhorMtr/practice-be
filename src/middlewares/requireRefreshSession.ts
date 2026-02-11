import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { verifyRefreshToken } from '../utils/jwt.js';
import type { AuthCookies } from '../types/index.js';

export const requireRefreshSession: RequestHandler = async (
  req,
  _res,
  next,
) => {
  const { sessionId, refreshToken } = req.cookies as AuthCookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session cookies');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.sessionId !== sessionId) {
      throw createHttpError(401, 'Invalid refresh token');
    }
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
    refreshTokenValidUntil: { $gt: new Date() },
  });

  if (!session) throw createHttpError(401, 'Session not found or expired');

  (req as any).sessionId = sessionId;
  next();
};
