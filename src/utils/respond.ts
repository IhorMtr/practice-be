import type { Response } from 'express';
import type { BaseResponse } from '../types/index.js';

export function ok<T>(
  res: Response,
  data: T,
  message: string | null = null,
  status = 200,
) {
  const body: BaseResponse<T> = {
    success: true,
    data,
    errors: null,
    message,
  };
  return res.status(status).json(body);
}

export function okNoData(
  res: Response,
  message: string | null = null,
  status = 200,
) {
  const body: BaseResponse<null> = {
    success: true,
    data: null,
    errors: null,
    message,
  };
  return res.status(status).json(body);
}
