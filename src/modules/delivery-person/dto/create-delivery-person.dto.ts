import { IsNotEmpty, Length } from 'class-validator';

export class CreateDeliveryPersonDto {
  constructor(
    user_id: string,
    cpf: string,
    cnh: string,
    bank: string,
    account_number: string,
    account_type: string,
  ) {
    this.user_id = user_id;
    this.cpf = cpf;
    this.cnh = cnh;
    this.bank = bank;
    this.account_number = account_number;
    this.account_type = account_type;
  }

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;

  @IsNotEmpty()
  cnh: string;

  @IsNotEmpty()
  bank: string;

  @IsNotEmpty()
  account_number: string;

  @IsNotEmpty()
  account_type: string;
}
