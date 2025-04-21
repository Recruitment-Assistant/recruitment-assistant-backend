import { PIN_CODE_FORMAT } from '@common/constants/app.constant';
import { StringField, TokenField } from '@common/decorators/field.decorators';
import { Expose } from 'class-transformer';
import { Matches } from 'class-validator';

export class VerifyPinCodeReqDto {
  @TokenField()
  token: string;

  @StringField({ name: 'pin_code' })
  @Expose({ name: 'pin_code' })
  @Matches(PIN_CODE_FORMAT)
  pinCode: string;
}
