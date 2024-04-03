import { Injectable } from '@nestjs/common';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { UpdateDeliveryPersonDto } from './dto/update-delivery-person.dto';

@Injectable()
export class DeliveryPersonService {
  create(createDeliveryPersonDto: CreateDeliveryPersonDto) {
    return 'This action adds a new deliveryPerson';
  }

  findAll() {
    return `This action returns all deliveryPerson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryPerson`;
  }

  update(id: number, updateDeliveryPersonDto: UpdateDeliveryPersonDto) {
    return `This action updates a #${id} deliveryPerson`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryPerson`;
  }
}
