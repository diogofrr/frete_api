import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(user: CreateUserDto): Promise<User | undefined> {
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

    return await this.prisma.user.create({
      data: {
        ...user,
        password: hash,
      },
    });
  }

  async delete(email: string): Promise<User | undefined> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.delete({
      where: {
        id: userExists.id,
      },
    });
  }
}
