import { model, Schema } from 'mongoose';

import { Session } from '../../types/interfaces/session.interface.js';

const sessionsSchema = new Schema<Session>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model<Session>('session', sessionsSchema);
