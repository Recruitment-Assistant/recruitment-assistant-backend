import { NumberField, StringField } from '@common/decorators/field.decorators';

export class RefreshResDto {
  @StringField({ name: 'access_token' })
  accessToken!: string;

  @StringField({ name: 'refresh_token' })
  refreshToken!: string;

  @NumberField({ name: 'token_expires' })
  tokenExpires!: number;
}
