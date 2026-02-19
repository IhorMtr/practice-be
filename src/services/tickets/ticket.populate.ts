import type { PopulateOptions } from 'mongoose';

export const ticketPopulate = [
  { path: 'clientId', select: 'fullName email' },
  { path: 'assignedTechnicianId', select: 'name email' },
  { path: 'history.actorId', select: 'name email' },
] satisfies PopulateOptions[];
