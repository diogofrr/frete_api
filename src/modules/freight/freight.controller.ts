import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FreightService } from './freight.service';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';

@Controller('freight')
export class FreightController {
  constructor(private readonly freightService: FreightService) {}

  @Post()
  create(@Body() createFreightDto: CreateFreightDto) {
    return this.freightService.create(createFreightDto);
  }

  @Get()
  findAll() {
    return this.freightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreightDto: UpdateFreightDto) {
    return this.freightService.update(+id, updateFreightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freightService.remove(+id);
  }
}
