import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { jwtConstants } from './constants';
import { Role } from '../roles/enum/role.enum';
import { DeliveryPersonService } from '../delivery-person/delivery-person.service';
import { CreateDeliveryPersonDto } from '../delivery-person/dto/create-delivery-person.dto';
import { ResponseDto } from '../global/dto/response.dto';
import { CompanyService } from '../company/company.service';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { SignUpDeliveryPersonDto } from './dto/sign-up-delivery-person.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from 'src/database/prisma.service';
import { SendEmailDto } from './dto/send-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { recoverPasswordEmail } from '../global/resources/recoverPasswordEmail';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private deliveryPerson: DeliveryPersonService,
    private company: CompanyService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailerService,
  ) {}

  async signIn(data: SignInDto): Promise<ResponseDto> {
    const user = await this.usersService.findOne(data.email);
    const isMatch = await bcrypt.compare(data.password, user.result.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = {
      sub: user.result.id,
      email: user.result.email,
      profile_type: user.result.profile_type,
      profile_id: null,
    };

    delete user.result.password;

    if (user.result.profile_type === Role.DELIVERY) {
      const profileData = await this.deliveryPerson.findOne(user.result.id);
      payload.profile_id = profileData.result.id;
    } else if (user.result.profile_type === Role.COMPANY) {
      const profileData = await this.company.findOne(user.result.id);
      payload.profile_id = profileData.result.id;
    }

    return new ResponseDto(false, 'Successfully logged in', {
      ...user.result,
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '2h',
      }),
    });
  }

  async singUpCompany(
    signUpCompanyDto: SignUpCompanyDto,
  ): Promise<ResponseDto> {
    const createUserDto = new CreateUserDto(
      signUpCompanyDto.name,
      signUpCompanyDto.email,
      signUpCompanyDto.tel,
      signUpCompanyDto.password,
      signUpCompanyDto.profile_type,
    );
    const user = await this.usersService.create(createUserDto);

    const companyDto = new CreateCompanyDto(
      user.result.id,
      signUpCompanyDto.cnpj,
      signUpCompanyDto.type,
      signUpCompanyDto.social_name,
      signUpCompanyDto.comercial_email,
    );
    const profileData = await this.company.create(companyDto);

    const payload = {
      sub: user.result.id,
      email: user.result.email,
      profile_type: user.result.profile_type,
      profile_id: profileData.result.id,
    };

    delete user.result.password;

    return new ResponseDto(false, 'Account created successfully', {
      ...user.result,
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '2h',
      }),
    });
  }

  async signUpDelivery(
    signUpDeliveryPersonDto: SignUpDeliveryPersonDto,
  ): Promise<ResponseDto> {
    const createUserDto = new CreateUserDto(
      signUpDeliveryPersonDto.name,
      signUpDeliveryPersonDto.email,
      signUpDeliveryPersonDto.tel,
      signUpDeliveryPersonDto.password,
      signUpDeliveryPersonDto.profile_type,
    );
    const user = await this.usersService.create(createUserDto);

    const deliveryPersonDto = new CreateDeliveryPersonDto(
      user.result.id,
      signUpDeliveryPersonDto.cpf,
      signUpDeliveryPersonDto.cnh,
      signUpDeliveryPersonDto.bank,
      signUpDeliveryPersonDto.account_number,
      signUpDeliveryPersonDto.account_type,
    );
    const profileData = await this.deliveryPerson.create(deliveryPersonDto);

    const payload = {
      sub: user.result.id,
      email: user.result.email,
      profile_type: user.result.profile_type,
      profile_id: profileData.result.id,
    };
    delete user.result.password;

    return new ResponseDto(false, 'Account created successfully', {
      ...user.result,
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '2h',
      }),
    });
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseDto | undefined> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: resetPasswordDto.email,
      },
    });

    if (!userExists) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }

    const compare = resetPasswordDto.token === userExists.resetPasswordToken;

    if (!compare) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    if (userExists.resetPasswordExpires > new Date()) {
      throw new HttpException(
        'Token expired, please generate a new one',
        HttpStatus.BAD_REQUEST,
      );
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(resetPasswordDto.new_password, saltOrRounds);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        password: hash,
      },
    });

    if (!updatedUser) {
      throw new HttpException('User not updated', HttpStatus.BAD_REQUEST);
    }

    return new ResponseDto(false, 'User updated successfully', null);
  }

  async sendEmail(
    sendEmailDto: SendEmailDto,
  ): Promise<ResponseDto | undefined> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: sendEmailDto.email,
      },
    });

    if (!userExists) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }

    const now = new Date();
    now.setHours(now.getHours() + 1);

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userExists.email, saltOrRounds);

    await this.prisma.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        resetPasswordExpires: now,
        resetPasswordToken: hash,
      },
    });

    await this.mailService.sendMail({
      to: userExists.email,
      from: 'Team Fretes <contadeatividades9199@gmail.com>',
      subject: 'Alteração de senha',
      html: recoverPasswordEmail(hash),
    });

    return new ResponseDto(false, 'Email sent successfully', null);
  }
}
