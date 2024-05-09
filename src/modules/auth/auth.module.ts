import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { DeliveryPersonService } from '../delivery-person/delivery-person.service';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UsersService,
    PrismaService,
    DeliveryPersonService,
    CompanyService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
