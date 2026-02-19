import { Types } from 'mongoose';

import type {
  ExpandedTicket,
  PopulatedTicketLean,
  ClientShort,
  IdNameEmail,
} from '../../types/index.js';
import { toIdString } from '../../utils/mongoose-ids.js';

type PopulatedClient = ClientShort & { _id: Types.ObjectId };
type PopulatedUser = IdNameEmail & { _id: Types.ObjectId };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const isPopulatedClient = (
  v: PopulatedTicketLean['clientId'],
): v is PopulatedClient =>
  isObject(v) &&
  !(v instanceof Types.ObjectId) &&
  '_id' in v &&
  'fullName' in v &&
  'email' in v;

const isPopulatedUser = (
  v: PopulatedTicketLean['assignedTechnicianId'],
): v is PopulatedUser =>
  isObject(v) &&
  !(v instanceof Types.ObjectId) &&
  '_id' in v &&
  'name' in v &&
  'email' in v;

const isPopulatedActor = (
  v: PopulatedTicketLean['history'][number]['actorId'],
): v is PopulatedUser =>
  isObject(v) &&
  !(v instanceof Types.ObjectId) &&
  '_id' in v &&
  'name' in v &&
  'email' in v;

const mapClient = (v: PopulatedTicketLean['clientId']): ClientShort | null => {
  if (!isPopulatedClient(v)) return null;
  return {
    _id: toIdString(v._id),
    fullName: v.fullName,
    email: v.email,
  };
};

const mapUser = (
  v: PopulatedTicketLean['assignedTechnicianId'],
): IdNameEmail | null => {
  if (!isPopulatedUser(v)) return null;
  return {
    _id: toIdString(v._id),
    name: v.name,
    email: v.email,
  };
};

const mapActor = (
  v: PopulatedTicketLean['history'][number]['actorId'],
): { actorId: string; actor: IdNameEmail | null } => {
  if (isPopulatedActor(v)) {
    const actor: IdNameEmail = {
      _id: toIdString(v._id),
      name: v.name,
      email: v.email,
    };
    return { actorId: actor._id, actor };
  }

  return { actorId: toIdString(v), actor: null };
};

export const getAssignedTechnicianId = (
  v: PopulatedTicketLean['assignedTechnicianId'],
): string | null => {
  if (!v) return null;
  if (isPopulatedUser(v)) return toIdString(v._id);
  return toIdString(v);
};

export const expandTicket = (t: PopulatedTicketLean): ExpandedTicket => ({
  _id: toIdString(t._id),
  client: mapClient(t.clientId),
  assignedTechnician: mapUser(t.assignedTechnicianId),
  deviceType: t.deviceType,
  problemDescription: t.problemDescription,
  priority: t.priority,
  status: t.status,
  estimatedCost: t.estimatedCost ?? null,
  finalCost: t.finalCost ?? null,
  history: Array.isArray(t.history)
    ? t.history.map((h) => {
        const { actorId, actor } = mapActor(h.actorId);

        return {
          at: h.at,
          action: h.action,
          fromStatus: h.fromStatus,
          toStatus: h.toStatus,
          toTechnicianId: h.toTechnicianId
            ? toIdString(h.toTechnicianId)
            : null,
          comment: h.comment,
          actorId,
          actor,
        };
      })
    : [],
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});
