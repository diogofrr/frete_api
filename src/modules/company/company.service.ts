import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ResponseDto } from '../global/dto/response.dto';
import { freightTaxCalc } from '../global/helper/freight-tax-calc';
import { CreateFreightDto } from './dto/create-freight.dto';
import { StatusRequestEnum } from './enum/freight-register-status.enum';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { DeleteFreightDto } from './dto/delete-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';
import { StatusShippingEnum } from '../delivery-person/enum/update-freight-status.enum';
import { ResponseRequestDto } from './dto/response-request.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<ResponseDto> {
    const companyExists = await this.prisma.company.findFirst({
      where: {
        user_id: createCompanyDto.user_id,
      },
    });

    if (companyExists) {
      throw new HttpException('Company already exists', HttpStatus.BAD_REQUEST);
    }

    const company = await this.prisma.company.create({
      data: createCompanyDto,
    });

    return new ResponseDto(false, 'Company created successfully', company);
  }

  async findOne(userId: string): Promise<ResponseDto> {
    const company = await this.prisma.company.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!company) {
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    return new ResponseDto(false, 'Company found successfully', company);
  }

  async createFreight(
    createFreightDto: CreateFreightDto,
    userId: string,
  ): Promise<ResponseDto> {
    const parcialValue =
      createFreightDto.distance * createFreightDto.min_weight;
    const tax = freightTaxCalc(parcialValue, createFreightDto.distance);

    const updatedFreightInfo = {
      name: createFreightDto.name,
      description: createFreightDto.description,
      min_weight: createFreightDto.min_weight,
      distance: createFreightDto.distance,
      fragile: createFreightDto.fragile,
      extra_observation: createFreightDto.extra_observation,
      value: parcialValue,
      tax: tax,
      total_value: parcialValue + tax,
      status_shipping: StatusShippingEnum.AGUARDANDO_COLETA,
      status_request: StatusRequestEnum.DISPONIVEL,
    };

    const freight = await this.prisma.freight.create({
      data: {
        ...updatedFreightInfo,
        freight_registers: {
          create: {
            company_id: userId,
          },
        },
        address: {
          create: {
            city: createFreightDto.city,
            state: createFreightDto.state,
            street: createFreightDto.street,
            address_number: createFreightDto.address_number,
            complement: createFreightDto.complement,
            zipcode: createFreightDto.zipcode,
            neighborhood: createFreightDto.neighborhood,
          },
        },
      },
    });

    return new ResponseDto(false, 'Freight created successfully', {
      freight,
    });
  }

  async updateFreightInfo(
    updateFreightDto: UpdateFreightDto,
    userId: string,
  ): Promise<ResponseDto> {
    const freightRegister = await this.prisma.freightRegister.findFirst({
      where: {
        company_id: userId,
        freight_id: updateFreightDto.id,
      },
      include: {
        freight: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!freightRegister) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    const {
      name,
      description,
      min_weight,
      distance,
      fragile,
      extra_observation,
      status_request,
      status_shipping,
      address: {
        city,
        state,
        street,
        address_number,
        complement,
        zipcode,
        neighborhood,
      },
    } = freightRegister.freight;
    const updatedMinWeight = updateFreightDto?.min_weight ?? min_weight;
    const updatedDistance = updateFreightDto?.distance ?? distance;
    const updatedParcialValue = updatedDistance * updatedMinWeight;
    const updatedTax = freightTaxCalc(
      updatedParcialValue,
      updateFreightDto.distance,
    );

    const updatedFreightInfo = {
      name: updateFreightDto?.name ?? name,
      description: updateFreightDto?.description ?? description,
      min_weight: updateFreightDto?.min_weight ?? min_weight,
      distance: updateFreightDto?.distance ?? distance,
      fragile: updateFreightDto?.fragile ?? fragile,
      extra_observation:
        updateFreightDto?.extra_observation ?? extra_observation,
      value: updatedParcialValue,
      tax: updatedTax,
      total_value: updatedParcialValue + updatedTax,
      status_shipping,
      status_request,
    };

    const address = {
      city: updateFreightDto?.city ?? city,
      state: updateFreightDto?.state ?? state,
      street: updateFreightDto?.street ?? street,
      address_number: updateFreightDto?.address_number ?? address_number,
      complement: updateFreightDto?.complement ?? complement,
      zipcode: updateFreightDto?.zipcode ?? zipcode,
      neighborhood: updateFreightDto?.neighborhood ?? neighborhood,
    };

    const updatedFreight = await this.prisma.freight.update({
      where: {
        id: updateFreightDto.id,
      },
      data: {
        ...updatedFreightInfo,
        address: {
          update: {
            ...address,
          },
        },
      },
      include: {
        address: true,
      },
    });

    if (!updatedFreight) {
      throw new HttpException('Freight not updated', HttpStatus.BAD_REQUEST);
    }

    return new ResponseDto(
      false,
      'Freight updated successfully',
      updatedFreight,
    );
  }

  async findOneFreight(id: string, userId: string): Promise<ResponseDto> {
    const freight = await this.prisma.freightRegister.findFirst({
      where: {
        freight_id: id,
        company_id: userId,
      },
      include: {
        freight: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!freight) {
      throw new HttpException(
        'Freight not found or access not allowed.',
        HttpStatus.NOT_FOUND,
      );
    }

    return new ResponseDto(false, 'Freight successfully found', freight);
  }

  async listMyFreights(listMyFreightsDto: ListMyFreightsDto, userId: string) {
    const { page, page_size: pageSize } = listMyFreightsDto;
    const offset = (page - 1) * pageSize;

    const freights = await this.prisma.freightRegister.findMany({
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

    return new ResponseDto(false, 'Freights found successfully', freights);
  }

  async requests(userId: string) {
    const freights = await this.prisma.freightRequest.findMany({
      where: {
        freight_register: {
          company_id: userId,
          freight: {
            status_request: StatusRequestEnum.SOLICITADO,
          },
        },
      },
      include: {
        delivery_person: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
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

    return new ResponseDto(false, '', freights);
  }

  async responseRequest(
    responseRequestDto: ResponseRequestDto,
    userId: string,
  ) {
    const freightRequest = await this.prisma.freightRequest.findFirst({
      where: {
        freight_register: {
          freight_id: responseRequestDto.freightId,
          company_id: userId,
        },
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

    if (!freightRequest) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    if (responseRequestDto.accepted) {
      await this.prisma.freight.update({
        where: {
          id: freightRequest.freight_register.freight.id,
        },
        data: {
          status_request: StatusRequestEnum.APROVADO,
        },
      });

      return new ResponseDto(false, 'Request accepted successfully', null);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.freightRequest.delete({
        where: {
          id: freightRequest.id,
        },
      });

      await tx.freight.update({
        where: {
          id: freightRequest.freight_register.freight.id,
        },
        data: {
          status_request: StatusRequestEnum.DISPONIVEL,
        },
      });
    });

    return new ResponseDto(false, 'Request rejected successfully', null);
  }

  async deleteFreight(deleteFreightDto: DeleteFreightDto, userId: string) {
    const freight = await this.prisma.freightRegister.findFirst({
      where: {
        freight_id: deleteFreightDto.freight_id,
        company_id: userId,
      },
      include: {
        freight: {
          select: {
            address: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!freight) {
      throw new HttpException(
        'Access not allowed or freight not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.freightRequest.deleteMany({
        where: {
          freight_register: {
            freight_id: freight.freight_id,
          },
        },
      });

      await tx.freightRegister.deleteMany({
        where: {
          freight: {
            id: freight.freight_id,
          },
        },
      });

      await tx.address.delete({
        where: {
          id: freight.freight.address.id,
        },
      });

      await tx.freight.delete({
        where: {
          id: deleteFreightDto.freight_id,
        },
      });
    });

    return new ResponseDto(false, 'Freight deleted successfully', null);
  }
}
