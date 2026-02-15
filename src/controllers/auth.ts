import type { RequestHandler, Response } from 'express';

import { THIRTY_DAYS } from '../constants/constants.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';
import type {
  RegisterBody,
  LoginBody,
  AuthCookies,
  AuthSession,
} from '../types/index.js';
import type { BaseResponse } from '../types/index.js';

const setupSession = (res: Response, session: AuthSession) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    secure: true,
    sameSite: 'none',
    path: '/',
  });
};

export const registerUserController: RequestHandler<
  {},
  BaseResponse<any>,
  RegisterBody
> = async (req, res) => {
  const user = await registerUser(req.body);

  const body: BaseResponse<typeof user> = {
    success: true,
    data: user,
    errors: null,
    message: 'User has been created successfully!',
  };

  res.status(201).json(body);
};

export const loginUserController: RequestHandler<
  {},
  BaseResponse<any>,
  LoginBody
> = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  const body: BaseResponse<{ accessToken: string }> = {
    success: true,
    data: { accessToken: session.accessToken },
    errors: null,
    message: 'User successfully logged in!',
  };

  res.status(200).json(body);
};

export const logoutUserController: RequestHandler<
  {},
  BaseResponse<null>
> = async (req, res) => {
  const sessionId = (req as any).sessionId as string;

  await logoutUser(sessionId);

  res.clearCookie('sessionId', { path: '/', sameSite: 'none', secure: true });
  res.clearCookie('refreshToken', {
    path: '/',
    sameSite: 'none',
    secure: true,
  });

  const body: BaseResponse<null> = {
    success: true,
    data: null,
    errors: null,
    message: null,
  };

  res.status(200).json(body);
};

export const refreshUsersSessionController: RequestHandler<
  {},
  BaseResponse<{ accessToken: string }>
> = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies as AuthCookies;

  const session = await refreshUsersSession({ sessionId, refreshToken });

  setupSession(res, session);

  const body: BaseResponse<{ accessToken: string }> = {
    success: true,
    data: { accessToken: session.accessToken },
    errors: null,
    message: 'Session refreshed successfully!',
  };

  res.status(200).json(body);
};
