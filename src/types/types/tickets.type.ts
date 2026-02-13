import { TicketPriority } from '../index.js';
import { TicketStatus } from '../index.js';

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
