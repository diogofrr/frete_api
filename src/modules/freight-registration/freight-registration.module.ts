import { Module } from '@nestjs/common';
import { FreightRegistrationService } from './freight-registration.service';
import { FreightRegistrationController } from './freight-registration.controller';

@Module({
  controllers: [FreightRegistrationController],
  providers: [FreightRegistrationService],
})
export class FreightRegistrationModule {}
