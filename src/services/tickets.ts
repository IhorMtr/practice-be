import createHttpError from 'http-errors';
import { isValidObjectId, Types } from 'mongoose';

import { TicketsCollection } from '../db/models/ticket.js';
import { ClientsCollection } from '../db/models/client.js';
import type {
  CreateTicketPayload,
  ManagerUpdatePayload,
  TicketPriority,
  TicketStatus,
  UserRole,
} from '../types/index.js';

export const createTicket = async (
  actorId: string,
  payload: CreateTicketPayload,
) => {
  if (!isValidObjectId(payload.clientId))
    throw createHttpError(400, 'Invalid clientId');

  const clientExists = await ClientsCollection.exists({
    _id: payload.clientId,
  });
  if (!clientExists) throw createHttpError(404, 'Client not found');

  const doc = await TicketsCollection.create({
    clientId: new Types.ObjectId(payload.clientId),
    deviceType: payload.deviceType,
    problemDescription: payload.problemDescription,
    priority: payload.priority ?? 'medium',
    status: 'new',
    assignedTechnicianId: null,
    estimatedCost: null,
    finalCost: null,
    history: [
      {
        at: new Date(),
        actorId: new Types.ObjectId(actorId),
        action: 'created',
      },
    ],
  });

  return doc;
};

export const listTickets = async (opts: {
  role: UserRole;
  actorId: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  clientId?: string;
}) => {
  const filter: any = {};

  if (opts.status) filter.status = opts.status;
  if (opts.priority) filter.priority = opts.priority;

  if (opts.clientId) {
    if (!isValidObjectId(opts.clientId))
      throw createHttpError(400, 'Invalid clientId');
    filter.clientId = opts.clientId;
  }

  if (opts.role === 'technician') {
    filter.assignedTechnicianId = opts.actorId;
  }

  return TicketsCollection.find(filter).sort({ createdAt: -1 });
};

export const getTicketById = async (opts: {
  id: string;
  role: UserRole;
  actorId: string;
}) => {
  if (!isValidObjectId(opts.id))
    throw createHttpError(400, 'Invalid ticket id');

  const ticket = await TicketsCollection.findById(opts.id);
  if (!ticket) throw createHttpError(404, 'Ticket not found');

  if (opts.role === 'technician') {
    if (!ticket.assignedTechnicianId) throw createHttpError(403, 'Forbidden');
    if (ticket.assignedTechnicianId.toString() !== opts.actorId) {
      throw createHttpError(403, 'Forbidden');
    }
  }

  return ticket;
};

export const updateTicketByManager = async (opts: {
  id: string;
  actorId: string;
  payload: ManagerUpdatePayload;
}) => {
  const ticket = await TicketsCollection.findById(opts.id);
  if (!ticket) throw createHttpError(404, 'Ticket not found');

  const actorObjectId = new Types.ObjectId(opts.actorId);

  if (opts.payload.status && opts.payload.status !== ticket.status) {
    ticket.history.push({
      at: new Date(),
      actorId: actorObjectId,
      action: 'status_changed',
      fromStatus: ticket.status,
      toStatus: opts.payload.status,
    });
    ticket.status = opts.payload.status;
  }

  if (opts.payload.assignedTechnicianId !== undefined) {
    const newId = opts.payload.assignedTechnicianId;
    const newObjId = newId === null ? null : new Types.ObjectId(newId);
    const old = ticket.assignedTechnicianId?.toString() ?? null;
    const next = newObjId?.toString() ?? null;

    if (old !== next) {
      ticket.history.push({
        at: new Date(),
        actorId: actorObjectId,
        action: 'technician_assigned',
        comment: next ? `assigned:${next}` : 'unassigned',
      });
      ticket.assignedTechnicianId = newObjId;
    }
  }

  const costChanged =
    (opts.payload.estimatedCost !== undefined &&
      opts.payload.estimatedCost !== ticket.estimatedCost) ||
    (opts.payload.finalCost !== undefined &&
      opts.payload.finalCost !== ticket.finalCost);

  if (costChanged) {
    ticket.history.push({
      at: new Date(),
      actorId: actorObjectId,
      action: 'cost_updated',
    });
    if (opts.payload.estimatedCost !== undefined)
      ticket.estimatedCost = opts.payload.estimatedCost;
    if (opts.payload.finalCost !== undefined)
      ticket.finalCost = opts.payload.finalCost;
  }

  if (opts.payload.deviceType !== undefined)
    ticket.deviceType = opts.payload.deviceType;
  if (opts.payload.problemDescription !== undefined)
    ticket.problemDescription = opts.payload.problemDescription;
  if (opts.payload.priority !== undefined)
    ticket.priority = opts.payload.priority;

  await ticket.save();
  return ticket;
};

export const updateTicketStatus = async (opts: {
  id: string;
  actorId: string;
  role: UserRole;
  status: TicketStatus;
  comment?: string | null;
}) => {
  const ticket = await getTicketById({
    id: opts.id,
    role: opts.role,
    actorId: opts.actorId,
  });

  if (opts.status !== ticket.status) {
    ticket.history.push({
      at: new Date(),
      actorId: new Types.ObjectId(opts.actorId),
      action: 'status_changed',
      fromStatus: ticket.status,
      toStatus: opts.status,
      comment: opts.comment ?? undefined,
    });
    ticket.status = opts.status;
    await ticket.save();
  } else if (opts.comment && opts.comment.trim() !== '') {
    ticket.history.push({
      at: new Date(),
      actorId: new Types.ObjectId(opts.actorId),
      action: 'comment',
      comment: opts.comment,
    });
    await ticket.save();
  }

  return ticket;
};
