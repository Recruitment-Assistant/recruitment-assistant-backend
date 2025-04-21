import { TokenField } from '@common/decorators/field.decorators';

export class ConfirmEmailReqDto {
  @TokenField()
  token: string;
}
