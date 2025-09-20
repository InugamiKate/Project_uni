
// Constants của jwt
export const TOKEN_TYPES = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
} as const;

export type TokenType = typeof TOKEN_TYPES[keyof typeof TOKEN_TYPES];

//Constants của account
export const ACCOUNT_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type AccountRole = typeof ACCOUNT_ROLES[keyof typeof ACCOUNT_ROLES];

// Constants của user
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  TEACHER: 'teacher',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];