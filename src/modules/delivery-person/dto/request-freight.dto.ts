import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class RequestFreightDto {
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  freightId: number;
}
