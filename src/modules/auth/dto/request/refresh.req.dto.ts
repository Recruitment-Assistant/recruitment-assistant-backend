import { TokenField } from '@common/decorators/field.decorators';
import { Expose } from 'class-transformer';

export class RefreshReqDto {
  @TokenField({ name: 'refresh_token' })
  @Expose({ name: 'refresh_token' })
  refreshToken!: string;
}
