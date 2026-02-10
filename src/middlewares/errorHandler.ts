import type { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Something went wrong';

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: message,
  });
};
