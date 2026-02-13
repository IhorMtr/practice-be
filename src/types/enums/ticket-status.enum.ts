export const TICKET_STATUSES = [
  'new',
  'in_progress',
  'done',
  'cancelled',
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
