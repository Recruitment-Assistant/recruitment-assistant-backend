import { AuthErrorCode } from '@common/constants/error-code/auth-errors.constant';
import { CommonError } from '@common/constants/error-code/common-errors.constant';
import { PermissionErrorCode } from '@common/constants/error-code/permission-errors.constant';
import { RoleErrorCode } from '@common/constants/error-code/role-errors.constant';
import { UserErrorCode } from '@common/constants/error-code/user-errors.constant';

export const ErrorCodeDetails = Object.freeze({
  ...CommonError,
  ...UserErrorCode,
  ...AuthErrorCode,
  ...RoleErrorCode,
  ...PermissionErrorCode,
});
