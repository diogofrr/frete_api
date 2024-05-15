import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Vehicles } from '../enum/vehicles.enum';

const year = new Date().getFullYear();
export class CreateVehicleDto {
  @IsNotEmpty()
  @IsEnum(Vehicles)
  vehicleType: Vehicles;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Max(10)
  @Min(1)
  classifWeight: number;

  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1900)
  @Max(year)
  year: number;
}
