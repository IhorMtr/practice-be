import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { AdminUpdatePayload } from '../types/index.js';

export const listUsers = async () => {
  const users = await UsersCollection.find().select('-password');
  return users;
};

export const getUserById = async (userId: string) => {
  const user = await UsersCollection.findById(userId).select('-password');
  return user;
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
