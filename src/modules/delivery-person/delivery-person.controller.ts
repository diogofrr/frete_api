import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeliveryPersonService } from './delivery-person.service';
import { ListAllFreightsDto } from './dto/list-all-freights.dto';
import { RequestFreightDto } from './dto/request-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';
import { UpdateFreightStatusDto } from './dto/update-freight-status.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('delivery-person')
export class DeliveryPersonController {
  constructor(private readonly deliveryPersonService: DeliveryPersonService) {}

  @Get('list-all-freights/')
  @UsePipes(new ValidationPipe({ transform: true }))
  listAllFreights(@Query() listAllFreightsDto: ListAllFreightsDto) {
    return this.deliveryPersonService.listAllFreights(listAllFreightsDto);
  }

  @Get('find-one-freight/')
  @UsePipes(new ValidationPipe({ transform: true }))
  listFreight(@Req() req, @Param('id') id: string) {
    return this.deliveryPersonService.findOneFreight(id, req.user.profile_id);
  }

  @Get('list-my-freights/')
  @UsePipes(new ValidationPipe({ transform: true }))
  listMyFreights(@Req() req, @Query() listMyFreightsDto: ListMyFreightsDto) {
    return this.deliveryPersonService.listMyFreights(
      listMyFreightsDto,
      req.user.profile_id,
    );
  }

  @Get('list-vehicles/')
  listVehicles(@Req() req) {
    return this.deliveryPersonService.listVehicles(req.user.profile_id);
  }

  @Post('update-freight-status/')
  updateStatus(
    @Req() req,
    @Body() updateFreightStatusDto: UpdateFreightStatusDto,
  ) {
    return this.deliveryPersonService.updateFreightStatus(
      updateFreightStatusDto,
      req.user.profile_id,
    );
  }

  @Post('create-vehicle/')
  createVehicle(@Req() req, @Body() createVehicleDto: CreateVehicleDto) {
    return this.deliveryPersonService.createVehicle(
      createVehicleDto,
      req.user.profile_id,
    );
  }

  @Patch('request-freight/')
  requestFreight(@Req() req, @Body() requestFreightDto: RequestFreightDto) {
    return this.deliveryPersonService.requestFreight(
      requestFreightDto,
      req.user.profile_id,
    );
  }

  @Patch('update-vehicle/')
  updateVehicle(@Req() req, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.deliveryPersonService.updateVehicle(
      updateVehicleDto,
      req.user.profile_id,
    );
  }
}
