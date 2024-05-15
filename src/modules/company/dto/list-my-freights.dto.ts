import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class ListMyFreightsDto {
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
  page_size: number;
}
