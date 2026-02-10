import type { UserRole } from '../enums/user-role.enum.js';

export interface User {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: UserRole | null;
}
