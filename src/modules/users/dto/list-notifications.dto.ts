import { Transform } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class ListNotificationsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform((params) => parseInt(params.value))
  page: number;
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform((params) => parseInt(params.value))
  pageSize: number;
}
