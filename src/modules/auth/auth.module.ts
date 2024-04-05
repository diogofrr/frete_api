import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { DeliveryPersonService } from '../delivery-person/delivery-person.service';

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
  ],
  exports: [AuthService],
})
export class AuthModule {}

// PASSAR PARA O MODULE PARA TORNAR TUDO PROTEGIDO
// providers: [
//   {
//     provide: APP_GUARD,
//     useClass: AuthGuard,
//   },
// ],
//                    OU
// PARA PROTEGER APENAS UMA ROTA
// @UseGuards(AuthGuard)
