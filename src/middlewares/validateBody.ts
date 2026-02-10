import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import type { ObjectSchema, ValidationError } from 'joi';

export const validateBody =
  (schema: ObjectSchema): RequestHandler =>
  async (req, _res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const e = err as ValidationError;

      next(
        createHttpError(400, 'Bad request', {
          errors: e.details,
        }),
      );
    }
  };
