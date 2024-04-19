import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  ValidationPipe,
  UsePipes,
  Patch,
  Param,
} from '@nestjs/common';
import { FreightService } from './freight.service';
import { CreateFreightDto } from './dto/create-freight.dto';
import { SearchFreightDto } from './dto/search-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';

@Controller('freight')
export class FreightController {
  constructor(private readonly freightService: FreightService) {}

  @Post()
  create(@Req() req, @Body() createFreightDto: CreateFreightDto) {
    return this.freightService.create(createFreightDto, req.user.sub);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  listPending(
    @Query()
    searchFreightDto: SearchFreightDto,
  ) {
    return this.freightService.listPending(searchFreightDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param('id') id: number) {
    return this.freightService.findOne(id);
  }

  @Patch('update-info/')
  updateStatus(@Req() req, @Body() updateFreightDto: UpdateFreightDto) {
    return this.freightService.update(updateFreightDto, req.user.sub);
  }
}
