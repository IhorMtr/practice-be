import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import { isValidObjectId } from 'mongoose';
import {
  listUsers,
  getUserById,
  updateUserByAdmin,
} from '../services/users.js';
import { IdParams } from '../types/index.js';

export const listUsersController: RequestHandler = async (_req, res) => {
  const users = await listUsers();

  res.json({
    status: 200,
    message: 'Users list',
    data: users,
  });
};

export const getUserByIdController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid user id');

  const user = await getUserById(id);
  if (!user) throw createHttpError(404, 'User not found');

  res.json({
    status: 200,
    message: 'User found',
    data: user,
  });
};

export const updateUserByAdminController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid user id');

  const updated = await updateUserByAdmin(id, req.body);

  res.json({
    status: 200,
    message: 'User updated',
    data: updated,
  });
};
