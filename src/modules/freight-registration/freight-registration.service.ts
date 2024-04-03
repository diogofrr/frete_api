import { Injectable } from '@nestjs/common';
import { CreateFreightRegistrationDto } from './dto/create-freight-registration.dto';
import { UpdateFreightRegistrationDto } from './dto/update-freight-registration.dto';

@Injectable()
export class FreightRegistrationService {
  create(createFreightRegistrationDto: CreateFreightRegistrationDto) {
    return 'This action adds a new freightRegistration';
  }

  findAll() {
    return `This action returns all freightRegistration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freightRegistration`;
  }

  update(
    id: number,
    updateFreightRegistrationDto: UpdateFreightRegistrationDto,
  ) {
    return `This action updates a #${id} freightRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} freightRegistration`;
  }
}
