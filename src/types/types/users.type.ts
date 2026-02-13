import { UserRole } from '../enums/user-role.enum.js';

export type AdminUpdatePayload = {
  role?: UserRole | null;
  isActive?: boolean;
};
