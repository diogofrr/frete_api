import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { Public } from './constants';
import { SignUpDeliveryPersonDto } from './dto/sign-up-delivery-person.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('register-company')
  signUpCompany(@Body() signUpCompanyDto: SignUpCompanyDto) {
    return this.authService.singUpCompany(signUpCompanyDto);
  }

  @Public()
  @Post('register-delivery')
  signUp(@Body() signUpDeliveryPersonDto: SignUpDeliveryPersonDto) {
    return this.authService.signUpDelivery(signUpDeliveryPersonDto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('send-email')
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.authService.sendEmail(sendEmailDto);
  }
}
