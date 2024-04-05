import { Module } from '@nestjs/common';
import { DeliveryPersonService } from './delivery-person.service';
import { DeliveryPersonController } from './delivery-person.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from 'src/database/prisma.service';
import { RolesGuard } from '../roles/roles.guard';

@Module({
  controllers: [DeliveryPersonController],
  providers: [
    PrismaService,
    DeliveryPersonService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class DeliveryPersonModule {}
