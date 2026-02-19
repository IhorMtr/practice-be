import type { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

import type { Ticket, TicketStatus } from '../../types/index.js';

export const pushCreated = (
  ticket: HydratedDocument<Ticket>,
  actorId: Types.ObjectId,
) => {
  ticket.history.push({
    at: new Date(),
    actorId,
    action: 'created',
  });
};

export const applyStatusChange = (
  ticket: HydratedDocument<Ticket>,
  actorId: Types.ObjectId,
  nextStatus: TicketStatus,
  comment?: string | null,
): boolean => {
  if (nextStatus === ticket.status) return false;

  ticket.history.push({
    at: new Date(),
    actorId,
    action: 'status_changed',
    fromStatus: ticket.status,
    toStatus: nextStatus,
    ...(comment?.trim() ? { comment: comment.trim() } : {}),
  });

  ticket.status = nextStatus;
  return true;
};

export const applyTechnicianAssignment = (
  ticket: HydratedDocument<Ticket>,
  actorId: Types.ObjectId,
  nextTechId: Types.ObjectId | null,
): boolean => {
  const old = ticket.assignedTechnicianId?.toString() ?? null;
  const next = nextTechId?.toString() ?? null;

  if (old === next) return false;

  ticket.history.push({
    at: new Date(),
    actorId,
    action: 'technician_assigned',
    toTechnicianId: nextTechId,
  });

  ticket.assignedTechnicianId = nextTechId;
  return true;
};

export const applyCostUpdate = (
  ticket: HydratedDocument<Ticket>,
  actorId: Types.ObjectId,
  patch: { estimatedCost?: number | null; finalCost?: number | null },
): boolean => {
  const estimatedChanged =
    patch.estimatedCost !== undefined &&
    patch.estimatedCost !== ticket.estimatedCost;

  const finalChanged =
    patch.finalCost !== undefined && patch.finalCost !== ticket.finalCost;

  if (!estimatedChanged && !finalChanged) return false;

  ticket.history.push({
    at: new Date(),
    actorId,
    action: 'cost_updated',
  });

  if (patch.estimatedCost !== undefined)
    ticket.estimatedCost = patch.estimatedCost;
  if (patch.finalCost !== undefined) ticket.finalCost = patch.finalCost;

  return true;
};

export const pushComment = (
  ticket: HydratedDocument<Ticket>,
  actorId: Types.ObjectId,
  comment: string,
): boolean => {
  const trimmed = comment.trim();
  if (!trimmed) return false;

  ticket.history.push({
    at: new Date(),
    actorId,
    action: 'comment',
    comment: trimmed,
  });

  return true;
};
