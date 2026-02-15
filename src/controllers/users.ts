import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

import {
  listUsers,
  getUserById,
  updateUserByAdmin,
} from '../services/users.js';
import type { IdParams, BaseResponse } from '../types/index.js';

export const listUsersController: RequestHandler<
  {},
  BaseResponse<any>
> = async (_req, res) => {
  const users = await listUsers();

  const body: BaseResponse<typeof users> = {
    success: true,
    data: users,
    errors: null,
    message: 'Users list',
  };

  res.status(200).json(body);
};

export const getUserByIdController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid user id');

  const user = await getUserById(id);
  if (!user) throw createHttpError(404, 'User not found');

  const body: BaseResponse<typeof user> = {
    success: true,
    data: user,
    errors: null,
    message: 'User found',
  };

  res.status(200).json(body);
};

export const updateUserByAdminController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid user id');

  const updated = await updateUserByAdmin(id, req.body);

  const body: BaseResponse<typeof updated> = {
    success: true,
    data: updated,
    errors: null,
    message: 'User updated',
  };

  res.status(200).json(body);
};
