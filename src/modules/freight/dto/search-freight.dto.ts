import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SearchFreightDto {
  @IsNotEmpty()
  @IsInt()
  @Transform((params) => parseInt(params.value))
  page: number;
  @IsNotEmpty()
  @IsInt()
  @Transform((params) => parseInt(params.value))
  pageSize: number;
}
