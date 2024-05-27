import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusShippingEnum } from '../enum/update-freight-status.enum';

export class UpdateFreightStatusDto {
  @IsNotEmpty()
  freightRequestId: string;

  @IsNotEmpty()
  @IsEnum(StatusShippingEnum)
  status: StatusShippingEnum;
}
