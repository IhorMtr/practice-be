import type { UserRole } from '../enums/user-role.enum.js';

export type AuthUser = {
  id: string;
  role: UserRole;
  isActive: boolean;
};
