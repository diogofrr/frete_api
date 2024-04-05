import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IAccessToken } from './interfaces/access-token.interface';
import { jwtConstants } from './constants';
import { Role } from '../roles/enum/role.enum';
import { DeliveryPersonService } from '../delivery-person/delivery-person.service';
import { CreateDeliveryPersonDto } from '../delivery-person/dto/create-delivery-person.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private deliveryPerson: DeliveryPersonService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<IAccessToken> {
    const user = await this.usersService.findOne(data.email);
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      profile_type: user.profile_type,
    };
    delete user.password;

    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '2h',
      }),
    };
  }

  async signUp(data: CreateUserDto): Promise<IAccessToken> {
    const user = await this.usersService.create(data);

    const payload = {
      sub: user.id,
      email: user.email,
      profile_type: user.profile_type,
    };
    delete user.password;

    const deliveryPersonDto = new CreateDeliveryPersonDto(user.id);

    if (user.profile_type === Role.DELIVERY) {
      await this.deliveryPerson.create(deliveryPersonDto);
    }

    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '2h',
      }),
    };
  }
}
