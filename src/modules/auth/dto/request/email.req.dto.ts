import { EmailField } from '@common/decorators/field.decorators';

export class EmailReqDto {
  @EmailField()
  email: string;
}
