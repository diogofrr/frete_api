import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private deliveryPerson: DeliveryPersonService,
    private company: CompanyService,
    private jwtService: JwtService,
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
}
