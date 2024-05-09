import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeliveryPersonService } from './delivery-person.service';
import { ListAllFreightsDto } from './dto/list-all-freights.dto';
import { RequestFreightDto } from './dto/request-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';

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
  listFreight(@Req() req, @Param('id') id: number) {
    return this.deliveryPersonService.findOneFreight(id, req.user.id);
  }

  @Get('list-my-freights/')
  @UsePipes(new ValidationPipe({ transform: true }))
  listMyFreights(@Req() req, @Query() listMyFreightsDto: ListMyFreightsDto) {
    return this.deliveryPersonService.listMyFreights(
      listMyFreightsDto,
      req.user.id,
    );
  }

  @Patch('request-freight/')
  requestFreight(@Req() req, @Body() requestFreightDto: RequestFreightDto) {
    return this.deliveryPersonService.requestFreight(
      requestFreightDto,
      req.user.id,
    );
  }
}
