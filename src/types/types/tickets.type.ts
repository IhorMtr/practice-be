import { Types } from 'mongoose';
import {
  ClientShort,
  IdNameEmail,
  Ticket,
  TicketPriority,
  TicketStatus,
  UserRole,
} from '../index.js';

export type TicketAction = Ticket['history'][number]['action'];

export type CreateTicketPayload = {
  clientId: string;
  deviceType: string;
  problemDescription: string;
  priority?: TicketPriority;
};

export type ManagerUpdatePayload = Partial<{
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTechnicianId: string | null;
  estimatedCost: number | null;
  finalCost: number | null;
}>;

export type ExpandedHistoryItem = {
  at: Date;
  action: TicketAction;
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  toTechnicianId?: string | null;
  comment?: string;
  actorId: string;
  actor: IdNameEmail | null;
};

export type ExpandedTicket = {
  _id: string;
  client: ClientShort | null;
  assignedTechnician: IdNameEmail | null;
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  estimatedCost: number | null;
  finalCost: number | null;
  history: ExpandedHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type PopulatedTicketLean = {
  _id: Types.ObjectId;
  clientId: (ClientShort & { _id: Types.ObjectId }) | null | Types.ObjectId;
  assignedTechnicianId:
    | (IdNameEmail & { _id: Types.ObjectId })
    | null
    | Types.ObjectId;
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  estimatedCost: number | null;
  finalCost: number | null;
  history: Array<{
    at: Date;
    actorId: (IdNameEmail & { _id: Types.ObjectId }) | Types.ObjectId;
    action: TicketAction;
    fromStatus?: TicketStatus;
    toStatus?: TicketStatus;
    toTechnicianId?: Types.ObjectId | null;
    comment?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export type ListTicketsOpts = {
  role: UserRole;
  actorId: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  clientId?: string;
  search?: string;
};
