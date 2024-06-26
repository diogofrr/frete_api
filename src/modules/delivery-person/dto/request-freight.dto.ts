import { IsNotEmpty } from 'class-validator';

export class RequestFreightDto {
  @IsNotEmpty()
  freightRegisterId: string;

  @IsNotEmpty()
  vehicleRegisterId: string;
}
