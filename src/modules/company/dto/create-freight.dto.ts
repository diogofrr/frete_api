import { IsDecimal, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFreightDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(10)
  min_weight: number;
  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  distance: number;
}
