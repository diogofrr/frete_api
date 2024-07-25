import {
  Controller,
  Get,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListNotificationsDto } from './dto/list-notifications.dto';

@ApiBearerAuth()
@ApiTags('Usuário')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list-all-notifications/')
  @UsePipes(new ValidationPipe({ transform: true }))
  listAllNotifications(
    @Req() req,
    @Query() listNotificationsDto: ListNotificationsDto,
  ) {
    return this.usersService.listNotifications(
      listNotificationsDto,
      req.user.profile_id,
    );
  }
}
