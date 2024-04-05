import { IsNotEmpty } from 'class-validator';

export class CreateDeliveryPersonDto {
  constructor(user_id: number) {
    this.user_id = user_id;
  }

  @IsNotEmpty()
  user_id: number;
}
