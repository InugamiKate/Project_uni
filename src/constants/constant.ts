
// Constants of jwt
export const TOKEN_TYPES = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
} as const;

export type TokenType = typeof TOKEN_TYPES[keyof typeof TOKEN_TYPES];

//Constants of account
export const ACCOUNT_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type AccountRole = typeof ACCOUNT_ROLES[keyof typeof ACCOUNT_ROLES];

// Constants of user
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PROGRAM_HEAD: 'program_head',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Constants of registration
export const REGIS_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Constants of student_course
export const STUDENT_COURSE_EXAM_STATUS = {
  NOT_ATTEMPTED: 'not_attempted',
  FAILED_ONE: 'failed_one',
  FAILED_TWO: 'failed_two',
  PASSED: 'passed',
  FAILED: 'failed'
} as const;

// Constants of class status
export const CLASS_STATUS = {
  CLOSED: 'closed',
  IN_PROCESS: 'in_process',
  AVAILABLE: 'available',
  NOT_AVAILABLE: 'not_available',
  MAX_NUM: 'max_num'
} as const;