import * as jwt from 'jsonwebtoken';

import type { UserRole } from '../enums/user-role.enum.js';

export type AccessPayload = {
  userId: string;
  role: UserRole;
};

export type RefreshPayload = {
  sessionId: string;
  userId: string;
};

export type ExpiresIn = jwt.SignOptions['expiresIn'];
