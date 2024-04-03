import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliveryPersonService } from './delivery-person.service';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { UpdateDeliveryPersonDto } from './dto/update-delivery-person.dto';

@Controller('delivery-person')
export class DeliveryPersonController {
  constructor(private readonly deliveryPersonService: DeliveryPersonService) {}

  @Post()
  create(@Body() createDeliveryPersonDto: CreateDeliveryPersonDto) {
    return this.deliveryPersonService.create(createDeliveryPersonDto);
  }

  @Get()
  findAll() {
    return this.deliveryPersonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryPersonService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryPersonDto: UpdateDeliveryPersonDto,
  ) {
    return this.deliveryPersonService.update(+id, updateDeliveryPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryPersonService.remove(+id);
  }
}
