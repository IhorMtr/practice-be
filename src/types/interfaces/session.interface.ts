import { Types } from 'mongoose';

export interface Session {
  userId: Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  accessTokenValidUntil: Date;
  refreshTokenValidUntil: Date;
}

export interface AuthSession {
  id: string;
  accessToken: string;
  refreshToken: string;
}
