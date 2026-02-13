import Joi from 'joi';

import { TICKET_PRIORITIES, TICKET_STATUSES } from '../types/index.js';

export const createTicketSchema = Joi.object({
  clientId: Joi.string().required(),
  deviceType: Joi.string().min(2).max(64).required(),
  problemDescription: Joi.string().min(2).max(2000).required(),
  priority: Joi.string()
    .valid(...TICKET_PRIORITIES)
    .default('medium'),
});

export const updateTicketByManagerSchema = Joi.object({
  deviceType: Joi.string().min(2).max(64),
  problemDescription: Joi.string().min(2).max(2000),
  priority: Joi.string().valid(...TICKET_PRIORITIES),

  status: Joi.string().valid(...TICKET_STATUSES),

  assignedTechnicianId: Joi.string().allow(null),

  estimatedCost: Joi.number().min(0).allow(null),
  finalCost: Joi.number().min(0).allow(null),
}).min(1);

export const updateTicketStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...TICKET_STATUSES)
    .required(),
  comment: Joi.string().max(2000).allow(null, ''),
});
