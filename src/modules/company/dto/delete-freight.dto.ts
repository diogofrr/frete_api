import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteFreightDto {
  @IsInt()
  @IsNotEmpty()
  freight_id: number;
}
