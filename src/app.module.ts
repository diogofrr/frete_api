import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DeliveryPersonModule } from './modules/delivery-person/delivery-person.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DeliveryPersonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [],
})
export class AppModule {}
