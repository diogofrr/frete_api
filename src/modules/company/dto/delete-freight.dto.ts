import { IsNotEmpty } from 'class-validator';

export class DeleteFreightDto {
  @IsNotEmpty()
  freight_id: string;
}
