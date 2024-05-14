import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ResponseDto } from '../global/dto/response.dto';
import { freightTaxCalc } from '../freight/helper/freight-tax-calc';
import { CreateFreightDto } from './dto/create-freight.dto';
import { StatusRequestEnum } from '../freight/enum/freight-register-status.enum';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { DeleteFreightDto } from './dto/delete-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';
import { StatusShippingEnum } from '../freight/enum/update-freight-status.enum';

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
      ...createFreightDto,
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
          create: [
            {
              company_id: userId,
            },
          ],
        },
      },
    });

    return new ResponseDto(false, 'Freight created successfully', {
      freight,
    });
  }

  async updateFreight(
    updateFreightDto: UpdateFreightDto,
    userId: string,
  ): Promise<ResponseDto> {
    const freightRegister = await this.prisma.freightRegister.findFirst({
      where: {
        company_id: userId,
        freight_id: updateFreightDto.id,
      },
    });

    if (!freightRegister) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    const parcialValue =
      updateFreightDto.distance * updateFreightDto.min_weight;
    const tax = freightTaxCalc(parcialValue, updateFreightDto.distance);

    const updatedFreight = await this.prisma.freight.update({
      where: {
        id: updateFreightDto.id,
      },
      data: {
        value: parcialValue,
        tax: tax,
        total_value: parcialValue + tax,
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
        freight: true,
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

  async acceptRequest(freightId: string, userId: string) {
    const freight = await this.prisma.freightRequest.findFirst({
      where: {
        freight_register: {
          freight_id: freightId,
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

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.freight.update({
      where: {
        id: freight.freight_register.freight.id,
      },
      data: {
        status_request: StatusRequestEnum.APROVADO,
      },
    });

    return new ResponseDto(false, 'Request accepted successfully', null);
  }

  async deleteFreight(deleteFreightDto: DeleteFreightDto, userId: string) {
    const freight = await this.prisma.freightRegister.findFirst({
      where: {
        freight_id: deleteFreightDto.freight_id,
        company_id: userId,
      },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma
      .$transaction(async (tx) => {
        await tx.freight.delete({
          where: {
            id: deleteFreightDto.freight_id,
          },
        });

        await tx.freightRegister.deleteMany({
          where: {
            freight_id: freight.id,
          },
        });

        await tx.freightRequest.deleteMany({
          where: {
            freight_register: {
              freight_id: freight.id,
            },
          },
        });
      })
      .catch(() => {
        throw new HttpException('Freight not deleted', HttpStatus.BAD_REQUEST);
      });

    return new ResponseDto(false, 'Freight deleted successfully', null);
  }
}
