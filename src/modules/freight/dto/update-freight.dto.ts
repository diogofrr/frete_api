import { PartialType } from '@nestjs/mapped-types';
import { CreateFreightDto } from './create-freight.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateFreightDto extends PartialType(CreateFreightDto) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
