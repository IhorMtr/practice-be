import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

import {
  createTicket,
  listTickets,
  getTicketById,
  updateTicketByManager,
  updateTicketStatus,
} from '../services/tickets.js';
import type { BaseResponse } from '../types/index.js';

export const createTicketController: RequestHandler<
  {},
  BaseResponse<any>
> = async (req, res) => {
  const user = req.user!;
  if (user.role !== 'admin' && user.role !== 'manager') {
    throw createHttpError(403, 'Forbidden');
  }

  const ticket = await createTicket(user.id, req.body);

  const body: BaseResponse<typeof ticket> = {
    success: true,
    data: ticket,
    errors: null,
    message: 'Ticket created',
  };

  res.status(201).json(body);
};

export const listTicketsController: RequestHandler<
  {},
  BaseResponse<any>
> = async (req, res) => {
  const user = req.user!;

  const status =
    typeof req.query.status === 'string' ? req.query.status : undefined;
  const priority =
    typeof req.query.priority === 'string' ? req.query.priority : undefined;
  const clientId =
    typeof req.query.clientId === 'string' ? req.query.clientId : undefined;
  const search =
    typeof req.query.search === 'string' ? req.query.search : undefined;

  const tickets = await listTickets({
    role: user.role,
    actorId: user.id,
    status: status as any,
    priority: priority as any,
    clientId,
    search,
  });

  const body: BaseResponse<typeof tickets> = {
    success: true,
    data: tickets,
    errors: null,
    message: 'Tickets list',
  };

  res.status(200).json(body);
};

type IdParams = { id: string };

export const getTicketByIdController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const user = req.user!;

  const ticket = await getTicketById({
    id: req.params.id,
    role: user.role,
    actorId: user.id,
  });

  const body: BaseResponse<typeof ticket> = {
    success: true,
    data: ticket,
    errors: null,
    message: 'Ticket found',
  };

  res.status(200).json(body);
};

export const updateTicketByManagerController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const user = req.user!;
  if (user.role !== 'admin' && user.role !== 'manager') {
    throw createHttpError(403, 'Forbidden');
  }

  if (!isValidObjectId(req.params.id)) {
    throw createHttpError(400, 'Invalid ticket id');
  }

  const updated = await updateTicketByManager({
    id: req.params.id,
    actorId: user.id,
    payload: req.body,
  });

  const body: BaseResponse<typeof updated> = {
    success: true,
    data: updated,
    errors: null,
    message: 'Ticket updated',
  };

  res.status(200).json(body);
};

export const updateTicketStatusController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const user = req.user!;

  const updated = await updateTicketStatus({
    id: req.params.id,
    actorId: user.id,
    role: user.role,
    status: req.body.status,
    comment: req.body.comment,
  });

  const body: BaseResponse<typeof updated> = {
    success: true,
    data: updated,
    errors: null,
    message: 'Ticket status updated',
  };

  res.status(200).json(body);
};
