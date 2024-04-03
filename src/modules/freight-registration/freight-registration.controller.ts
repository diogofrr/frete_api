import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FreightRegistrationService } from './freight-registration.service';
import { CreateFreightRegistrationDto } from './dto/create-freight-registration.dto';
import { UpdateFreightRegistrationDto } from './dto/update-freight-registration.dto';

@Controller('freight-registration')
export class FreightRegistrationController {
  constructor(
    private readonly freightRegistrationService: FreightRegistrationService,
  ) {}

  @Post()
  create(@Body() createFreightRegistrationDto: CreateFreightRegistrationDto) {
    return this.freightRegistrationService.create(createFreightRegistrationDto);
  }

  @Get()
  findAll() {
    return this.freightRegistrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freightRegistrationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreightRegistrationDto: UpdateFreightRegistrationDto,
  ) {
    return this.freightRegistrationService.update(
      +id,
      updateFreightRegistrationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freightRegistrationService.remove(+id);
  }
}
