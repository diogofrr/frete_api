import { PartialType } from '@nestjs/mapped-types';
import { CreateFreightDto } from '../../company/dto/create-freight.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateFreightDto extends PartialType(CreateFreightDto) {
  @IsNotEmpty()
  id: string;
}
