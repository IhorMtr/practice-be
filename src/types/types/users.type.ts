import { UserRole } from '../enums/user-role.enum.js';

export type IdParams = { id: string };

export type AdminUpdatePayload = {
  role?: UserRole | null;
  isActive?: boolean;
};
