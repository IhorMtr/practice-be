import type { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import type { BaseResponse, KnownError } from '../types/index.js';

export const errorHandler: ErrorRequestHandler = (
  err: KnownError,
  _req,
  res,
  _next,
) => {
  if (err?.errors) {
    const status = err.statusCode ?? 400;
    const body: BaseResponse<null> = {
      success: false,
      data: null,
      errors: err.errors,
      message: err.message ?? 'Validation error',
    };
    return res.status(status).json(body);
  }

  if (err instanceof HttpError) {
    const body: BaseResponse<null> = {
      success: false,
      data: null,
      errors: null,
      message: err.message || 'Request error',
    };
    return res.status(err.statusCode ?? 500).json(body);
  }

  const body: BaseResponse<null> = {
    success: false,
    data: null,
    errors: null,
    message: (err as any)?.message ?? 'Internal server error',
  };
  return res.status(500).json(body);
};
