import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehicleRegistrationService } from './vehicle-registration.service';
import { CreateVehicleRegistrationDto } from './dto/create-vehicle-registration.dto';
import { UpdateVehicleRegistrationDto } from './dto/update-vehicle-registration.dto';

@Controller('vehicle-registration')
export class VehicleRegistrationController {
  constructor(
    private readonly vehicleRegistrationService: VehicleRegistrationService,
  ) {}

  @Post()
  create(@Body() createVehicleRegistrationDto: CreateVehicleRegistrationDto) {
    return this.vehicleRegistrationService.create(createVehicleRegistrationDto);
  }

  @Get()
  findAll() {
    return this.vehicleRegistrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleRegistrationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleRegistrationDto: UpdateVehicleRegistrationDto,
  ) {
    return this.vehicleRegistrationService.update(
      +id,
      updateVehicleRegistrationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleRegistrationService.remove(+id);
  }
}
