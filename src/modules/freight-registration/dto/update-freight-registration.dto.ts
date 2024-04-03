import { PartialType } from '@nestjs/mapped-types';
import { CreateFreightRegistrationDto } from './create-freight-registration.dto';

export class UpdateFreightRegistrationDto extends PartialType(
  CreateFreightRegistrationDto,
) {}
