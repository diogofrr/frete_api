import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryPersonDto } from './create-delivery-person.dto';

export class UpdateDeliveryPersonDto extends PartialType(
  CreateDeliveryPersonDto,
) {}
