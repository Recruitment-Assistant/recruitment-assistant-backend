import { PASSWORD_FORMAT } from '@common/constants/app.constant';
import { EmailField, PasswordField } from '@common/decorators/field.decorators';
import { Matches } from 'class-validator';

export class LoginReqDto {
  @EmailField()
  email!: string;

  @PasswordField()
  @Matches(PASSWORD_FORMAT, {
    message:
      'Password must contain only letters, numbers, and at least one special character (!@#$%^&*(),.?":{}|<>)',
  })
  password!: string;
}
