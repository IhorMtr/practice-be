import createHttpError from 'http-errors';
import { isValidObjectId, Types } from 'mongoose';

export const toIdString = (v: unknown): string => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (v instanceof Types.ObjectId) return v.toString();

  if (typeof v === 'object' && 'toString' in (v as any)) {
    return (v as any).toString();
  }

  return String(v);
};

export const toObjectIdOrThrow = (
  id: string,
  message: string,
): Types.ObjectId => {
  if (!isValidObjectId(id)) throw createHttpError(400, message);
  return new Types.ObjectId(id);
};

export const toNullableObjectIdOrThrow = (
  id: string | null,
  message: string,
): Types.ObjectId | null => {
  if (id === null) return null;
  return toObjectIdOrThrow(id, message);
};

export const escapeRegExp = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
