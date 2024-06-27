import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
