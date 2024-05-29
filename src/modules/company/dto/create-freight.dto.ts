import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFreightDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @MaxLength(200)
  description: string;

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

  @IsNotEmpty()
  fragile: boolean;

  @IsNotEmpty()
  @MaxLength(200)
  extra_observation: string;

  @IsNotEmpty()
  @Length(8, 8)
  zipcode: string;

  @IsNotEmpty()
  @MaxLength(50)
  street: string;

  @IsNotEmpty()
  @MaxLength(6)
  address_number: string;

  @MaxLength(50)
  complement: string;

  @IsNotEmpty()
  @MaxLength(20)
  neighborhood: string;

  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsNotEmpty()
  @MaxLength(20)
  state: string;
}
