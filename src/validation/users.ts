import Joi from 'joi';
import { USER_ROLES } from '../types/index.js';

export const updateUserByAdminSchema = Joi.object({
  role: Joi.string()
    .valid(...USER_ROLES)
    .allow(null),
  isActive: Joi.boolean(),
}).min(1);
