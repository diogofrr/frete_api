import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { DeleteFreightDto } from './dto/delete-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';
import { ResponseRequestDto } from './dto/response-request.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/enum/role.enum';
@UseGuards(RolesGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(Role.COMPANY)
  @Post('create-freight/')
  create(@Req() req, @Body() createFreightDto: CreateFreightDto) {
    return this.companyService.createFreight(
      createFreightDto,
      req.user.profile_id,
    );
  }

  @Roles(Role.COMPANY)
  @Get('find-one-freight/')
  findOne(@Req() req, @Param('id') id: string) {
    return this.companyService.findOneFreight(id, req.user.profile_id);
  }

  @Roles(Role.COMPANY)
  @Get('list-my-freights/')
  @UsePipes(new ValidationPipe({ transform: true }))
  listMyFreights(@Req() req, @Query() listMyFreightsDto: ListMyFreightsDto) {
    return this.companyService.listMyFreights(
      listMyFreightsDto,
      req.user.profile_id,
    );
  }

  @Roles(Role.COMPANY)
  @Get('requests/')
  requests(@Req() req) {
    return this.companyService.requests(req.user.profile_id);
  }

  @Roles(Role.COMPANY)
  @Patch('response-request/')
  responseRequest(@Req() req, @Body() responseRequestDto: ResponseRequestDto) {
    return this.companyService.responseRequest(
      responseRequestDto,
      req.user.profile_id,
    );
  }

  @Roles(Role.COMPANY)
  @Patch('update-info/')
  updateInfo(@Req() req, @Body() updateFreightDto: UpdateFreightDto) {
    return this.companyService.updateFreightInfo(
      updateFreightDto,
      req.user.profile_id,
    );
  }

  @Roles(Role.COMPANY)
  @Delete('delete-freight/')
  deleteFreight(@Req() req, @Body() deleteFreightDto: DeleteFreightDto) {
    return this.companyService.deleteFreight(
      deleteFreightDto,
      req.user.profile_id,
    );
  }
}
