import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../roles/enum/role.enum';

export class SignUpDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  profile_type: string;
}
