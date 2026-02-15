import type { RequestHandler } from 'express';
import type Joi from 'joi';
import { ValidationErrorShape } from '../types/types/validate-body.type.js';

export const validateBody =
  (schema: Joi.ObjectSchema): RequestHandler =>
  async (req, _res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (e: any) {
      const errors: Record<string, string[]> = {};

      const details = Array.isArray(e?.details) ? e.details : [];
      for (const d of details) {
        const key =
          Array.isArray(d.path) && d.path.length ? d.path.join('.') : 'body';
        if (!errors[key]) errors[key] = [];
        if (typeof d.message === 'string') errors[key].push(d.message);
      }

      const err: ValidationErrorShape = {
        statusCode: 400,
        message: 'Validation error',
        errors,
      };

      next(err);
    }
  };
