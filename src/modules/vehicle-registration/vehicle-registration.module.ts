import { Module } from '@nestjs/common';
import { VehicleRegistrationService } from './vehicle-registration.service';
import { VehicleRegistrationController } from './vehicle-registration.controller';

@Module({
  controllers: [VehicleRegistrationController],
  providers: [VehicleRegistrationService],
})
export class VehicleRegistrationModule {}
