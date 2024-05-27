import { IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Role } from 'src/modules/roles/enum/role.enum';

export class CreateUserDto {
  constructor(
    name: string,
    email: string,
    tel: string,
    password: string,
    profile_type: string,
  ) {
    this.name = name;
    this.email = email;
    this.tel = tel;
    this.password = password;
    this.profile_type = profile_type;
  }

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(11, 11)
  tel: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  profile_type: string;
}
