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
  any,
  RegisterBody
> = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User has been created successfully!',
    data: user,
  });
};

export const loginUserController: RequestHandler<{}, any, LoginBody> = async (
  req,
  res,
) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'User successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController: RequestHandler = async (req, res) => {
  const sessionId = (req as any).sessionId as string;

  await logoutUser(sessionId);

  res.clearCookie('sessionId', { path: '/', sameSite: 'none', secure: true });
  res.clearCookie('refreshToken', {
    path: '/',
    sameSite: 'none',
    secure: true,
  });

  res.status(204).send();
};

export const refreshUsersSessionController: RequestHandler = async (
  req,
  res,
) => {
  const { sessionId, refreshToken } = req.cookies as AuthCookies;

  const session = await refreshUsersSession({ sessionId, refreshToken });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Session refreshed successfully!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
