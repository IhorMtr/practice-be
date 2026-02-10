import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import type { AuthUser } from '../types/index.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate: RequestHandler = async (req, _res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw createHttpError(401, 'Authorization token is required');
  }

  const [scheme, token] = authHeader.trim().split(/\s+/);

  if (scheme !== 'Bearer' || !token) {
    throw createHttpError(
      401,
      'Authorization header must use the Bearer scheme',
    );
  }

  let payload: { userId: string };
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw createHttpError(401, 'Invalid access token');
  }

  const session = await SessionsCollection.findOne({
    accessToken: token,
    accessTokenValidUntil: { $gt: new Date() },
  });

  if (!session) throw createHttpError(401, 'Session not found or expired');

  if (session.userId.toString() !== payload.userId) {
    throw createHttpError(401, 'Token does not match session');
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) throw createHttpError(401, 'User not found');
  if (user.isActive === false) throw createHttpError(403, 'User is inactive');
  if (user.role === null)
    throw createHttpError(403, 'User role is not assigned yet');

  const authUser: AuthUser = {
    id: user._id.toString(),
    role: user.role,
    isActive: user.isActive,
  };

  req.user = authUser;
  next();
};
