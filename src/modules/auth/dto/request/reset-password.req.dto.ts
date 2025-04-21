import { PASSWORD_FORMAT } from '@common/constants/app.constant';
import { PasswordField, TokenField } from '@common/decorators/field.decorators';
import { MatchPassword } from '@common/decorators/validators/match-password.decorator';
import { Matches } from 'class-validator';

export class ResetPasswordReqDto {
  @PasswordField()
  @Matches(PASSWORD_FORMAT, {
    message:
      'Password must contain only letters, numbers, and at least one special character (!@#$%^&*(),.?":{}|<>)',
  })
  password!: string;

  @PasswordField()
  @MatchPassword('password')
  confirm_password!: string;

  @TokenField()
  token!: string;
}
