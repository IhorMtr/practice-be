import { Schema, model } from 'mongoose';
import type { User } from '../../types/index.js';
import { USER_ROLES } from '../../types/index.js';

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    role: { type: String, enum: USER_ROLES, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export const UsersCollection = model<User>('user', userSchema);
