import { Module } from '@nestjs/common';
import { FreightService } from './freight.service';
import { FreightController } from './freight.controller';
import { PrismaService } from 'src/database/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../roles/roles.guard';

@Module({
  controllers: [FreightController],
  providers: [
    FreightService,
    PrismaService,
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
export class FreightModule {}
