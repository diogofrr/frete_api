import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleRegistrationDto } from './create-vehicle-registration.dto';

export class UpdateVehicleRegistrationDto extends PartialType(
  CreateVehicleRegistrationDto,
) {}
