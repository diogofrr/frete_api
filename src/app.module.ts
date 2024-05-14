import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DeliveryPersonModule } from './modules/delivery-person/delivery-person.module';
import { CompanyModule } from './modules/company/company.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DeliveryPersonModule,
    CompanyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [],
})
export class AppModule {}
