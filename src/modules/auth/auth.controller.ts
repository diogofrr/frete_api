import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { Public } from './constants';
import { SignUpDeliveryPersonDto } from './dto/sign-up-delivery-person.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendEmailDto } from './dto/send-email.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Autenticar um usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado com sucesso.',
    type: SignInDto,
  })
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Registrar uma empresa.' })
  @Public()
  @Post('register-company')
  signUpCompany(@Body() signUpCompanyDto: SignUpCompanyDto) {
    return this.authService.singUpCompany(signUpCompanyDto);
  }

  @ApiOperation({ summary: 'Registrar um entregador.' })
  @Public()
  @Post('register-delivery')
  signUp(@Body() signUpDeliveryPersonDto: SignUpDeliveryPersonDto) {
    return this.authService.signUpDelivery(signUpDeliveryPersonDto);
  }

  @ApiOperation({
    summary: 'Resetar a senha de um usuário utilizando um token.',
  })
  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({
    summary: 'Enviar um token via email para resetar a senha de um usuário.',
  })
  @Public()
  @Post('send-email')
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.authService.sendEmail(sendEmailDto);
  }

  @ApiOperation({
    summary: 'Atualizar o token do usuário.',
  })
  @Put('refresh-token')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req);
  }
}
