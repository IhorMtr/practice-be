// ================ INTERFACES ================

export type { User } from './interfaces/user.interface.js';
export type { Session } from './interfaces/session.interface.js';
export type { AuthSession } from './interfaces/session.interface.js';
export type { Client } from './interfaces/client.interface.js';
export type {
  Ticket,
  TicketHistoryItem,
} from './interfaces/ticket.interface.js';

// ================ TYPES ================

export type { AuthUser } from './types/auth-user.type.js';
export type {
  AccessPayload,
  RefreshPayload,
  ExpiresIn,
} from './types/jwt-payload.type.js';

export type {
  RegisterBody,
  LoginBody,
  AuthCookies,
} from './types/auth.type.js';

export type { AdminUpdatePayload } from './types/users.type.js';
export type {
  CreateClientPayload,
  UpdateClientPayload,
} from './types/client.type.js';
export type { IdParams } from './types/global.type.js';
export type {
  CreateTicketPayload,
  ManagerUpdatePayload,
} from './types/tickets.type.js';

// ================ ENUMS ================

export { USER_ROLES, type UserRole } from './enums/user-role.enum.js';
export {
  TICKET_STATUSES,
  type TicketStatus,
} from './enums/ticket-status.enum.js';
export {
  TICKET_PRIORITIES,
  type TicketPriority,
} from './enums/ticket-priority.enum.js';
