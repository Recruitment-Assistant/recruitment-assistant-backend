import { TokenField } from '@common/decorators/field.decorators';

export class TokenDto {
  @TokenField()
  token: string;
}
