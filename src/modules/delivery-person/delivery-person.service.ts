import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Status } from '../freight/enum/freight-register.enum';
import { ResponseDto } from '../global/dto/response.dto';

@Injectable()
export class DeliveryPersonService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDeliveryPersonDto: CreateDeliveryPersonDto,
  ): Promise<ResponseDto> {
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

    return new ResponseDto(
      false,
      'Delivery person created successfully',
      deliveryPerson,
    );
  }

  async findOne(id: number): Promise<ResponseDto> {
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

    return new ResponseDto(
      false,
      'Delivery person found successfully',
      deliveryPerson,
    );
  }

  async remove(id: number): Promise<ResponseDto> {
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

    return new ResponseDto(false, 'Delivery person removed successfully', null);
  }

  async requestShipping(
    freightId: number,
    userId: number,
  ): Promise<ResponseDto> {
    const freightRegister = await this.prisma.freightRegistration.findFirst({
      where: {
        freight_id: freightId,
      },
    });

    if (!freightRegister) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    const freightUpdated = await this.prisma.freightRegistration.update({
      where: {
        id: freightRegister.id,
      },
      data: {
        status_request: Status.REQUESTED,
        delivery_person_id: userId,
      },
    });

    return new ResponseDto(
      false,
      'Freight requested successfully',
      freightUpdated,
    );
  }
}
