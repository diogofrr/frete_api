import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DeliveryPersonModule } from './modules/delivery-person/delivery-person.module';
import { CompanyModule } from './modules/company/company.module';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';

dotenv.config();

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
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [],
})
export class AppModule {}
