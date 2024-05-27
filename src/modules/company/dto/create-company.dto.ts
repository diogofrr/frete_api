import { IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  constructor(
    user_id: string,
    cnpj: string,
    type: string,
    social_name: string,
    comercial_email: string,
  ) {
    this.user_id = user_id;
    this.cnpj = cnpj;
    this.type = type;
    this.social_name = social_name;
    this.comercial_email = comercial_email;
  }

  @IsNotEmpty()
  user_id: string;
  @Length(14, 14)
  @IsNotEmpty()
  cnpj: string;
  @MaxLength(50)
  @IsNotEmpty()
  type: string;
  @MaxLength(100)
  @IsNotEmpty()
  social_name: string;
  @IsEmail()
  @IsNotEmpty()
  comercial_email: string;
}
