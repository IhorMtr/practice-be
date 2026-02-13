import Joi from 'joi';

export const createClientSchema = Joi.object({
  fullName: Joi.string().min(2).max(64).required(),
  email: Joi.string().email().max(128).required(),
  notes: Joi.string().max(2000).allow(null, ''),
});

export const updateClientSchema = Joi.object({
  fullName: Joi.string().min(2).max(64),
  email: Joi.string().email().max(128),
  notes: Joi.string().max(2000).allow(null, ''),
}).min(1);
