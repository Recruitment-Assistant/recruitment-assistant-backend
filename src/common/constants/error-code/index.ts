export enum ErrorCode {
  // Validation Errors
  COMMON = 'V000',
  FILE_NOT_EMPTY = 'V001',

  // User Errors
  USERNAME_OR_EMAIL_EXISTS = 'USER_001',
  USER_NOT_FOUND = 'USER_002',
  EMAIL_EXISTS = 'USER_003',
  CODE_INCORRECT = 'USER_004',
  REQUEST_DELETE_ACCOUNT_INVALID = 'USER_005',

  // Authentication Errors
  INVALID_CREDENTIALS = 'AUTH_001',
  UNAUTHORIZED = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',
  TOKEN_INVALID = 'AUTH_004',
  ACCESS_DENIED = 'AUTH_005',
  REFRESH_TOKEN_INVALID = 'AUTH_006',
  ACCOUNT_LOCKED = 'AUTH_007',
  ACCOUNT_DISABLED = 'AUTH_008',
  FORBIDDEN = 'AUTH_009',
  ACCOUNT_NOT_ACTIVATED = 'AUTH_010',
  ACCOUNT_ALREADY_ACTIVATED = 'AUTH_011',
  ACCOUNT_NOT_REGISTER = 'AUTH_012',
  OLD_PASSWORD_INCORRECT = 'AUTH_013',

  // Role Errors
  ROLE_NOT_FOUND = 'ROLE_001',
  ROLE_NAME_EXIST = 'ROLE_002',

  // Permission Errors
  PERMISSION_INVALID = 'PERMISSION_001',
  PERMISSION_ALREADY_EXISTS_IN_ROLE = 'PERMISSION_002',
}
