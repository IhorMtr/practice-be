import createHttpError from 'http-errors';
import { isValidObjectId, Types } from 'mongoose';

import type {
  CreateTicketPayload,
  ExpandedTicket,
  ManagerUpdatePayload,
  PopulatedTicketLean,
  TicketStatus,
  UserRole,
} from '../../types/index.js';
import { TicketsCollection } from '../../db/models/ticket.js';
import { ticketPopulate } from './ticket.populate.js';
import { expandTicket, getAssignedTechnicianId } from './ticket.mapper.js';
import {
  toNullableObjectIdOrThrow,
  toObjectIdOrThrow,
} from '../../utils/mongoose-ids.js';
import { ClientsCollection } from '../../db/models/client.js';
import { buildTicketsFilter } from './ticket.filters.js';
import {
  applyCostUpdate,
  applyStatusChange,
  applyTechnicianAssignment,
  pushComment,
} from './ticket.history.js';

const getExpandedTicketOrThrow = async (
  id: string | Types.ObjectId,
): Promise<ExpandedTicket> => {
  const doc = await TicketsCollection.findById(id)
    .populate(ticketPopulate)
    .lean<PopulatedTicketLean>();

  if (!doc) throw createHttpError(404, 'Ticket not found');
  return expandTicket(doc);
};

export const createTicket = async (
  actorId: string,
  payload: CreateTicketPayload,
) => {
  const actorObjectId = toObjectIdOrThrow(actorId, 'Invalid actorId');

  const clientObjectId = toObjectIdOrThrow(
    payload.clientId,
    'Invalid clientId',
  );

  const clientExists = await ClientsCollection.exists({ _id: clientObjectId });
  if (!clientExists) throw createHttpError(404, 'Client not found');

  const doc = await TicketsCollection.create({
    clientId: clientObjectId,
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
        actorId: actorObjectId,
        action: 'created',
      },
    ],
  });

  return getExpandedTicketOrThrow(doc._id);
};

export const listTickets = async (opts: {
  role: UserRole;
  actorId: string;
  status?: TicketStatus;
  priority?: any;
  clientId?: string;
  search?: string;
}) => {
  const filter = buildTicketsFilter(opts as any);

  const docs = await TicketsCollection.find(filter)
    .sort({ createdAt: -1 })
    .populate(ticketPopulate)
    .lean<PopulatedTicketLean[]>();

  return docs.map(expandTicket);
};

export const getTicketById = async (opts: {
  id: string;
  role: UserRole;
  actorId: string;
}) => {
  if (!isValidObjectId(opts.id))
    throw createHttpError(400, 'Invalid ticket id');

  const doc = await TicketsCollection.findById(opts.id)
    .populate(ticketPopulate)
    .lean<PopulatedTicketLean>();

  if (!doc) throw createHttpError(404, 'Ticket not found');

  if (opts.role === 'technician') {
    const assignedId = getAssignedTechnicianId(doc.assignedTechnicianId);
    if (!assignedId || assignedId !== opts.actorId)
      throw createHttpError(403, 'Forbidden');
  }

  return expandTicket(doc);
};

export const updateTicketByManager = async (opts: {
  id: string;
  actorId: string;
  payload: ManagerUpdatePayload;
}) => {
  if (!isValidObjectId(opts.id))
    throw createHttpError(400, 'Invalid ticket id');

  const ticket = await TicketsCollection.findById(opts.id);
  if (!ticket) throw createHttpError(404, 'Ticket not found');

  const actorObjectId = toObjectIdOrThrow(opts.actorId, 'Invalid actorId');

  if (opts.payload.status) {
    applyStatusChange(ticket, actorObjectId, opts.payload.status);
  }

  if (opts.payload.assignedTechnicianId !== undefined) {
    const nextTechId = toNullableObjectIdOrThrow(
      opts.payload.assignedTechnicianId,
      'Invalid assignedTechnicianId',
    );

    applyTechnicianAssignment(ticket, actorObjectId, nextTechId);
  }

  applyCostUpdate(ticket, actorObjectId, {
    estimatedCost: opts.payload.estimatedCost,
    finalCost: opts.payload.finalCost,
  });

  if (opts.payload.deviceType !== undefined)
    ticket.deviceType = opts.payload.deviceType;
  if (opts.payload.problemDescription !== undefined)
    ticket.problemDescription = opts.payload.problemDescription;
  if (opts.payload.priority !== undefined)
    ticket.priority = opts.payload.priority;

  await ticket.save();
  return getExpandedTicketOrThrow(ticket._id);
};

export const updateTicketStatus = async (opts: {
  id: string;
  actorId: string;
  role: UserRole;
  status: TicketStatus;
  comment?: string | null;
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

  const actorObjectId = toObjectIdOrThrow(opts.actorId, 'Invalid actorId');

  let changed = false;

  changed =
    applyStatusChange(ticket, actorObjectId, opts.status, opts.comment) ||
    changed;

  if (!changed && opts.comment?.trim()) {
    changed = pushComment(ticket, actorObjectId, opts.comment) || changed;
  }

  if (changed) await ticket.save();
  return getExpandedTicketOrThrow(ticket._id);
};
