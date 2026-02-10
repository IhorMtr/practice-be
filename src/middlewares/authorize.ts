import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import type { UserRole } from '../types/index.js';

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    const user = req.user;

    if (!user) {
      throw createHttpError(401, 'Not authenticated');
    }

    if (!allowedRoles.includes(user.role)) {
      throw createHttpError(403, 'Forbidden');
    }

    next();
  };
};
