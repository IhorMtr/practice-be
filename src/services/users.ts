import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import type { AdminUpdatePayload } from '../types/index.js';

export const listUsers = async () => {
  return UsersCollection.find().select('-password');
};

export const getUserById = async (userId: string) => {
  return UsersCollection.findById(userId).select('-password');
};

export const updateUserByAdmin = async (
  userId: string,
  payload: AdminUpdatePayload,
) => {
  const updated = await UsersCollection.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
    select: '-password',
  });

  if (!updated) throw createHttpError(404, 'User not found');
  return updated;
};

export const listTechnicians = async () => {
  return UsersCollection.find({ role: 'technician' }).select('-password');
};
