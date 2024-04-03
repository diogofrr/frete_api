import { Injectable } from '@nestjs/common';
import { CreateVehicleRegistrationDto } from './dto/create-vehicle-registration.dto';
import { UpdateVehicleRegistrationDto } from './dto/update-vehicle-registration.dto';

@Injectable()
export class VehicleRegistrationService {
  create(createVehicleRegistrationDto: CreateVehicleRegistrationDto) {
    return 'This action adds a new vehicleRegistration';
  }

  findAll() {
    return `This action returns all vehicleRegistration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicleRegistration`;
  }

  update(
    id: number,
    updateVehicleRegistrationDto: UpdateVehicleRegistrationDto,
  ) {
    return `This action updates a #${id} vehicleRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicleRegistration`;
  }
}
