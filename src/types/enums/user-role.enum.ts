export const USER_ROLES = ['admin', 'manager', 'technician'] as const;

export type UserRole = (typeof USER_ROLES)[number];
