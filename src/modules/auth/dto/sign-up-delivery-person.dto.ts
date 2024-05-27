import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class SignUpDeliveryPersonDto extends CreateUserDto {
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;
  @IsNotEmpty()
  @IsUrl()
  cnh: string;
  @IsNotEmpty()
  bank: string;
  @IsNotEmpty()
  account_number: string;
  @IsNotEmpty()
  account_type: string;
}
