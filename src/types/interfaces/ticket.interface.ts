import type { Types } from 'mongoose';
import type { TicketPriority } from '../enums/ticket-priority.enum.js';
import type { TicketStatus } from '../enums/ticket-status.enum.js';

export interface TicketHistoryItem {
  at: Date;
  actorId: Types.ObjectId;
  action:
    | 'created'
    | 'status_changed'
    | 'technician_assigned'
    | 'cost_updated'
    | 'comment';
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  comment?: string;
}

export interface Ticket {
  clientId: Types.ObjectId;
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTechnicianId?: Types.ObjectId | null;
  estimatedCost?: number | null;
  finalCost?: number | null;
  history: TicketHistoryItem[];
}
