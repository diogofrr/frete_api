import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { jwtConstants } from './constants';
import { Role } from '../roles/enum/role.enum';
import { DeliveryPersonService } from '../delivery-person/delivery-person.service';
import { CreateDeliveryPersonDto } from '../delivery-person/dto/create-delivery-person.dto';
import { ResponseDto } from '../global/dto/response.dto';
import { CompanyService } from '../company/company.service';

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

  async signUp(data: CreateUserDto): Promise<ResponseDto> {
    const user = await this.usersService.create(data);

    const payload = {
      sub: user.result.id,
      email: user.result.email,
      profile_type: user.result.profile_type,
      profile_id: null,
    };
    delete user.result.password;

    const deliveryPersonDto = new CreateDeliveryPersonDto(user.result.id);

    if (user.result.profile_type === Role.DELIVERY) {
      const profileData = await this.deliveryPerson.create(deliveryPersonDto);
      payload.profile_id = profileData.result.id;
    } else if (user.result.profile_type === Role.COMPANY) {
      const profileData = await this.company.create(deliveryPersonDto);
      payload.profile_id = profileData.result.id;
    }

    return new ResponseDto(false, 'Account created successfully', {
      ...user.result,
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '2h',
      }),
    });
  }
}
