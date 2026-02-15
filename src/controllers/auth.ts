import type { RequestHandler } from 'express';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';
import type { RegisterBody, LoginBody } from '../types/index.js';
import type { BaseResponse } from '../types/index.js';

type RefreshBody = { refreshToken: string };
type LogoutBody = { refreshToken: string };

export const registerUserController: RequestHandler<
  {},
  BaseResponse<any>,
  RegisterBody
> = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    data: user,
    errors: null,
    message: 'User has been created successfully!',
  });
};

export const loginUserController: RequestHandler<
  {},
  BaseResponse<any>,
  LoginBody
> = async (req, res) => {
  const session = await loginUser(req.body);

  res.status(200).json({
    success: true,
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    errors: null,
    message: 'User successfully logged in!',
  });
};

export const refreshUsersSessionController: RequestHandler<
  {},
  BaseResponse<{ accessToken: string; refreshToken: string }>,
  RefreshBody
> = async (req, res) => {
  const session = await refreshUsersSession(req.body.refreshToken);

  res.status(200).json({
    success: true,
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    errors: null,
    message: 'Session refreshed successfully!',
  });
};

export const logoutUserController: RequestHandler<
  {},
  BaseResponse<null>,
  LogoutBody
> = async (req, res) => {
  await logoutUser(req.body.refreshToken);

  res.status(200).json({
    success: true,
    data: null,
    errors: null,
    message: null,
  });
};
