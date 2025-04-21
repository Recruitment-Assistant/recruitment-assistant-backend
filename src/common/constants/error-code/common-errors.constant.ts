import { ErrorCode } from '@common/constants/error-code/index';

export const CommonError: Record<string, string> = {
  [ErrorCode.COMMON]: 'common.validation.error',
  [ErrorCode.FILE_NOT_EMPTY]: 'file.validation.is_empty',
};
