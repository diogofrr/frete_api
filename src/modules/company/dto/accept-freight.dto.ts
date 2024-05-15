import { IsNotEmpty } from 'class-validator';

export class AcceptFreightDto {
  @IsNotEmpty()
  freightId: string;
}
