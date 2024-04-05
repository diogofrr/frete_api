import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DeliveryPersonService {
  constructor(private prisma: PrismaService) {}

  async create(createDeliveryPersonDto: CreateDeliveryPersonDto) {
    const deliveryPersonExists = await this.prisma.deliveryPerson.findFirst({
      where: {
        user_id: createDeliveryPersonDto.user_id,
      },
    });

    if (deliveryPersonExists) {
      throw new HttpException(
        'Delivery person already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deliveryPerson = await this.prisma.deliveryPerson.create({
      data: createDeliveryPersonDto,
    });

    return deliveryPerson;
  }

  async findOne(id: number) {
    const deliveryPerson = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!deliveryPerson) {
      throw new HttpException(
        'Delivery person not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return deliveryPerson;
  }

  async remove(id: number) {
    const deliveryPerson = await this.prisma.deliveryPerson.delete({
      where: {
        id,
      },
    });

    if (!deliveryPerson) {
      throw new HttpException(
        'Delivery person does not exists',
        HttpStatus.NOT_FOUND,
      );
    }

    return deliveryPerson;
  }
}
