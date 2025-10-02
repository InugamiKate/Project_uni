
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

// Constants of student_course
export const STUDENT_COURSE_EXAM_STATUS = {
  NOT_ATTEMPTED: 'not_attempted',
  PASSED: 'passed',
  FAILED: 'failed'
} as const;

// Constants of class_status
export const CLASS_STATUS = {
  CLOSED: 'closed',
  IN_PROCESS: 'in_process',
  NEW: 'new',
  REGIST_AVAILABLE: 'regist_available',
} as const;

// Constants of class regist_status
export const REGIST_STATUS = {
  CLOSED: 'closed',
  OPEN: 'open',
  MAX_NUM: 'max_num',
} as const

// Constants of class_regist
export const CLASS_REGIST = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

// Constants of exam_status
export const EXAM_STATUS = {
  CLOSED: 'closed',
  IN_PROCESS: 'in_process',
  NEW: 'new',
  REGIST_AVAILABLE: 'regist_available',
} as const;

// Constants of exam_attend
export const EXAM_ATTEND = {
  ATTENDED: 'attended',
  NOT_ATTENDED: 'not_attended',
} as const;

// Constants of exam_regist
export const EXAM_REGIST = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const