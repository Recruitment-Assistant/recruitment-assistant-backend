import { PASSWORD_FORMAT } from '@common/constants/app.constant';
import { PasswordField } from '@common/decorators/field.decorators';
import { MatchPassword } from '@common/decorators/validators/match-password.decorator';
import { Matches } from 'class-validator';

export class ChangePasswordReqDto {
  @PasswordField()
  old_password: string;

  @PasswordField()
  @Matches(PASSWORD_FORMAT, {
    message:
      'Password must contain only letters, numbers, and at least one special character (!@#$%^&*(),.?":{}|<>)',
  })
  new_password!: string;

  @PasswordField()
  @MatchPassword('new_password')
  confirm_new_password: string;
}
