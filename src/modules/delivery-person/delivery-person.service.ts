import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ResponseDto } from '../global/dto/response.dto';
import { ListAllFreightsDto } from './dto/list-all-freights.dto';
import { StatusRequestEnum } from '../freight/enum/freight-register-status.enum';
import { RequestFreightDto } from './dto/request-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';
import { UpdateFreightStatusDto } from './dto/update-freight-status.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { StatusShippingEnum } from '../freight/enum/update-freight-status.enum';

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

  async findOne(userId: string): Promise<ResponseDto> {
    const deliveryPerson = await this.prisma.deliveryPerson.findFirst({
      where: {
        id: userId,
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

  async listAllFreights(
    listAllFreightsDto: ListAllFreightsDto,
  ): Promise<ResponseDto> {
    const { page, pageSize } = listAllFreightsDto;

    const offset = (page - 1) * pageSize;
    const allFreightsRegisters = await this.prisma.freightRequest.findMany({
      skip: offset,
      take: pageSize,
      where: {
        freight_register: {
          freight: {
            status_request: StatusRequestEnum.DISPONIVEL,
          },
        },
      },
      include: {
        freight_register: {
          include: {
            company: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            freight: {
              select: {
                distance: true,
                total_value: true,
                min_weight: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
    return new ResponseDto(false, '', allFreightsRegisters);
  }

  async findOneFreight(id: string, userId: string) {
    const freight = await this.prisma.freightRegister.findFirst({
      where: {
        freight_id: id,
      },
      include: {
        company: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        freight: {
          select: {
            distance: true,
            total_value: true,
            min_weight: true,
            tax: true,
            value: true,
            status_request: true,
            status_shipping: true,
          },
        },
      },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    if (
      freight.company_id !== userId &&
      freight.freight.status_request !== StatusRequestEnum.DISPONIVEL
    ) {
      throw new HttpException('Access not allowed', HttpStatus.BAD_REQUEST);
    }

    return new ResponseDto(false, '', freight);
  }

  async requestFreight(
    requestFreightDto: RequestFreightDto,
    userId: string,
  ): Promise<ResponseDto> {
    const freightRequest = await this.prisma.$transaction(async (tx) => {
      const freightRequest = await tx.freightRequest.create({
        data: {
          delivery_person_id: userId,
          vehicle_register_id: requestFreightDto.vehicleId,
          freight_register_id: requestFreightDto.freightRegisterId,
        },
        include: {
          freight_register: {
            include: {
              freight: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const freight = await tx.freight.update({
        where: {
          id: freightRequest.freight_register.freight.id,
        },
        data: {
          status_request: StatusRequestEnum.SOLICITADO,
          status_shipping: StatusShippingEnum.AGUARDANDO_COLETA,
        },
      });

      return {
        freight,
        freightRequest,
      };
    });

    return new ResponseDto(
      false,
      'Freight successfully requested',
      freightRequest,
    );
  }

  async listMyFreights(listMyFreightsDto: ListMyFreightsDto, userId: string) {
    const { page, pageSize } = listMyFreightsDto;

    const offset = (page - 1) * pageSize;

    const myFreights = await this.prisma.freightRegister.findMany({
      skip: offset,
      take: pageSize,
      where: {
        company_id: userId,
      },
      include: {
        freight: true,
        freight_requests: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return new ResponseDto(false, 'Freights found successfully', myFreights);
  }

  async updateFreightStatus(
    updateFreightStatusDto: UpdateFreightStatusDto,
    userId: string,
  ) {
    const freight = await this.prisma.freightRequest.findFirst({
      where: {
        id: updateFreightStatusDto.freightRequestId,
      },
      include: {
        freight_register: {
          include: {
            freight: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    if (freight.delivery_person_id !== userId) {
      throw new HttpException('Access not allowed', HttpStatus.BAD_REQUEST);
    }

    const freightUpdated = await this.prisma.freight.update({
      where: {
        id: freight.freight_register.freight.id,
      },
      data: {
        status_request: updateFreightStatusDto.status,
      },
    });

    return new ResponseDto(
      false,
      'Status updated successfully',
      freightUpdated,
    );
  }

  async createVehicle(createVehicleDto: CreateVehicleDto, userId: string) {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        classif_weight: createVehicleDto.classifWeight,
        vehicle_type: createVehicleDto.vehicleType,
      },
    });

    const vehicleRegister = await this.prisma.vehicleRegistration.create({
      data: {
        delivery_person_id: userId,
        vehicle_id: vehicle.id,
      },
    });

    return new ResponseDto(false, 'Vehicle created successfully', {
      vehicle,
      vehicleRegister,
    });
  }

  async updateVehicle(updateVehicleDto: UpdateVehicleDto, userId: string) {
    const vehicleRegister = await this.prisma.vehicleRegistration.findFirst({
      where: {
        delivery_person_id: userId,
        vehicle_id: updateVehicleDto.id,
      },
    });

    if (!vehicleRegister) {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const vehicle = await this.prisma.vehicle.update({
      where: {
        id: updateVehicleDto.id,
      },
      data: {
        ...updateVehicleDto,
        classif_weight: updateVehicleDto.classifWeight,
        vehicle_type: updateVehicleDto.vehicleType,
      },
    });

    return new ResponseDto(false, 'Vehicle updated successfully', vehicle);
  }

  async listVehicles(userId: string) {
    const vehicles = await this.prisma.vehicleRegistration.findMany({
      where: {
        delivery_person_id: userId,
      },
      include: {
        vehicle: true,
      },
    });

    return new ResponseDto(false, 'Vehicles found successfully', vehicles);
  }
}
