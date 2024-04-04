import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enum/profile-type.enum';

export class SignUpDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  profile_type: string;
}
