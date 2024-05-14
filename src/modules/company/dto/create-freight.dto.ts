import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateFreightDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(10)
  min_weight: number;
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(0)
  distance: number;
}
