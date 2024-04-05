import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/modules/roles/enum/role.enum';

export class CreateUserDto {
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
