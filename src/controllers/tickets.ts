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

export const createTicketController: RequestHandler = async (req, res) => {
  const user = req.user!;
  if (user.role !== 'admin' && user.role !== 'manager') {
    throw createHttpError(403, 'Forbidden');
  }

  const ticket = await createTicket(user.id, req.body);

  res.status(201).json({
    status: 201,
    message: 'Ticket created',
    data: ticket,
  });
};

export const listTicketsController: RequestHandler = async (req, res) => {
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

  res.json({
    status: 200,
    message: 'Tickets list',
    data: tickets,
  });
};

type IdParams = { id: string };

export const getTicketByIdController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const user = req.user!;
  const ticket = await getTicketById({
    id: req.params.id,
    role: user.role,
    actorId: user.id,
  });

  res.json({
    status: 200,
    message: 'Ticket found',
    data: ticket,
  });
};

export const updateTicketByManagerController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const user = req.user!;
  if (user.role !== 'admin' && user.role !== 'manager') {
    throw createHttpError(403, 'Forbidden');
  }

  if (!isValidObjectId(req.params.id))
    throw createHttpError(400, 'Invalid ticket id');

  const updated = await updateTicketByManager({
    id: req.params.id,
    actorId: user.id,
    payload: req.body,
  });

  res.json({
    status: 200,
    message: 'Ticket updated',
    data: updated,
  });
};

export const updateTicketStatusController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const user = req.user!;

  const updated = await updateTicketStatus({
    id: req.params.id,
    actorId: user.id,
    role: user.role,
    status: req.body.status,
    comment: req.body.comment,
  });

  res.json({
    status: 200,
    message: 'Ticket status updated',
    data: updated,
  });
};
