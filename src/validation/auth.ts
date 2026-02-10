import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(1).max(32).required(),
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(128).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
