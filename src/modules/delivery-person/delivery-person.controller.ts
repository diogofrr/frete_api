import { Controller } from '@nestjs/common';
import { DeliveryPersonService } from './delivery-person.service';

@Controller('delivery-person')
export class DeliveryPersonController {
  constructor(private readonly deliveryPersonService: DeliveryPersonService) {}
}
