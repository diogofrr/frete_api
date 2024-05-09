import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Status } from '../freight/enum/freight-register.enum';
import { ResponseDto } from '../global/dto/response.dto';
import { ListAllFreightsDto } from './dto/list-all-freights.dto';
import { Status as StatusFreightRegistration } from '../freight/enum/freight-register.enum';
import { RequestFreightDto } from './dto/request-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';

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

  async listAllFreights(
    listAllFreightsDto: ListAllFreightsDto,
  ): Promise<ResponseDto> {
    const { page, pageSize } = listAllFreightsDto;

    const offset = (page - 1) * pageSize;
    const allFreightsRegisters = await this.prisma.freightRegistration.findMany(
      {
        skip: offset,
        take: pageSize,
        where: {
          status_request: StatusFreightRegistration.PENDING,
        },
        include: {
          freight: true,
        },
        orderBy: {
          id: 'desc',
        },
      },
    );
    return new ResponseDto(false, '', allFreightsRegisters);
  }

  async findOneFreight(id: number, userId: number) {
    const freight = await this.prisma.freightRegistration.findFirst({
      where: {
        freight_id: id,
      },
      include: {
        freight: true,
      },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    if (
      freight.status_request !== StatusFreightRegistration.PENDING &&
      freight.delivery_person_id === userId
    ) {
      throw new HttpException(
        'Freight is not available or access not allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new ResponseDto(false, '', freight);
  }

  async requestFreight(
    requestFreightDto: RequestFreightDto,
    userId: number,
  ): Promise<ResponseDto> {
    const freightRegister = await this.prisma.freightRegistration.findFirst({
      where: {
        freight_id: requestFreightDto.freightId,
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

  async listMyFreights(listMyFreightsDto: ListMyFreightsDto, userId: number) {
    const { page, pageSize } = listMyFreightsDto;

    const offset = (page - 1) * pageSize;

    const myFreights = await this.prisma.freightRegistration.findMany({
      skip: offset,
      take: pageSize,
      where: {
        company_id: userId,
      },
      include: {
        freight: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return new ResponseDto(false, 'Freights found successfully', myFreights);
  }
}
