import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ResponseRequestDto {
  @IsNotEmpty()
  freightId: string;

  @IsNotEmpty()
  @IsBoolean()
  accepted: boolean;
}
