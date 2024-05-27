import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class SignUpCompanyDto extends CreateUserDto {
  @IsNotEmpty()
  @Length(14, 14)
  cnpj: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  @MaxLength(50)
  social_name: string;
  @IsNotEmpty()
  @IsEmail()
  comercial_email: string;
}
