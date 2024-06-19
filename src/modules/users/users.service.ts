import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ResponseDto } from '../global/dto/response.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<ResponseDto | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new ResponseDto(false, 'User found successfully', user);
  }

  async create(user: CreateUserDto): Promise<ResponseDto | undefined> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(user.password, saltOrRounds);

    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        tel: user.tel,
        profile_type: user.profile_type,
        password: hash,
        updated_at: new Date(),
      },
    });

    if (!createdUser) {
      throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
    }

    return new ResponseDto(false, 'User created successfully', {
      ...createdUser,
      password: '',
    });
  }

  async delete(email: string): Promise<ResponseDto | undefined> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }

    const deletedUser = await this.prisma.user.delete({
      where: {
        id: userExists.id,
      },
    });

    if (!deletedUser) {
      throw new HttpException('User not deleted', HttpStatus.BAD_REQUEST);
    }

    return new ResponseDto(false, 'User deleted successfully', null);
  }

  async recoverPassword(
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

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userExists.email, saltOrRounds);

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
}
