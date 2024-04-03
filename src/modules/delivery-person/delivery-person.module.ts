import { Module } from '@nestjs/common';
import { DeliveryPersonService } from './delivery-person.service';
import { DeliveryPersonController } from './delivery-person.controller';

@Module({
  controllers: [DeliveryPersonController],
  providers: [DeliveryPersonService],
})
export class DeliveryPersonModule {}
