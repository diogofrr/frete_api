import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusRequestEnum } from '../../freight/enum/freight-register-status.enum';

export class UpdateFreightStatusDto {
  @IsNotEmpty()
  freightRequestId: string;

  @IsNotEmpty()
  @IsEnum(StatusRequestEnum)
  status: StatusRequestEnum;
}
