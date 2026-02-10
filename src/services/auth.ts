import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import type {
  RegisterBody,
  LoginBody,
  AuthSession,
  UserRole,
} from '../types/index.js';

async function createJwtSession(user: {
  _id: { toString(): string };
  role: UserRole;
}): Promise<AuthSession> {
  const accessMin = Number(getEnvVar('JWT_ACCESS_EXPIRES_MIN', '15'));
  const refreshDays = Number(getEnvVar('JWT_REFRESH_EXPIRES_DAYS', '7'));

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken: 'tmp',
    refreshToken: 'tmp',
    accessTokenValidUntil: new Date(Date.now() + accessMin * 60 * 1000),
    refreshTokenValidUntil: new Date(
      Date.now() + refreshDays * 24 * 60 * 60 * 1000,
    ),
  });

  const accessToken = signAccessToken(
    { userId: user._id.toString(), role: user.role },
    accessMin * 60,
  );

  const refreshToken = signRefreshToken(
    { sessionId: session._id.toString(), userId: user._id.toString() },
    refreshDays * 24 * 60 * 60,
  );

  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  session.accessTokenValidUntil = new Date(Date.now() + accessMin * 60 * 1000);
  session.refreshTokenValidUntil = new Date(
    Date.now() + refreshDays * 24 * 60 * 60 * 1000,
  );

  await session.save();

  return {
    id: session._id.toString(),
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
}

export const registerUser = async (userData: RegisterBody) => {
  const existing = await UsersCollection.findOne({ email: userData.email });
  if (existing) {
    throw createHttpError(409, 'Email already in use. Try different one');
  }

  const { name, email, password } = userData;
  const encryptedPassword = await bcrypt.hash(password, 10);

  const created = await UsersCollection.create({
    name,
    email,
    password: encryptedPassword,
    role: null,
    isActive: true,
  });

  return {
    id: created._id.toString(),
    name: created.name,
    email: created.email,
    role: created.role,
    isActive: created.isActive,
  };
};

export const loginUser = async (userData: LoginBody): Promise<AuthSession> => {
  const user = await UsersCollection.findOne({ email: userData.email }).select(
    '+password',
  );

  if (!user) throw createHttpError(401, 'Invalid email or password');
  if (user.isActive === false) throw createHttpError(403, 'User is inactive');

  if (user.role === null) {
    throw createHttpError(403, 'User role is not assigned yet');
  }

  const ok = await bcrypt.compare(userData.password, user.password);
  if (!ok) throw createHttpError(401, 'Invalid email or password');

  await SessionsCollection.deleteOne({ userId: user._id });

  return createJwtSession({ _id: user._id, role: user.role });
};

export const logoutUser = async (sessionId: string) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({
  sessionId,
  refreshToken,
}: {
  sessionId?: string;
  refreshToken?: string;
}): Promise<AuthSession> => {
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
  });

  if (!session) throw createHttpError(401, 'Session not found');

  if (
    !session.refreshTokenValidUntil ||
    Date.now() > new Date(session.refreshTokenValidUntil).getTime()
  ) {
    throw createHttpError(401, 'Session token expired');
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) throw createHttpError(401, 'User not found');
  if (user.isActive === false) throw createHttpError(403, 'User is inactive');

  if (user.role === null) {
    throw createHttpError(403, 'User role is not assigned yet');
  }

  await SessionsCollection.deleteOne({ _id: sessionId });

  return createJwtSession({ _id: user._id, role: user.role });
};
