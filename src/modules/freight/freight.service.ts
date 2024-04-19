import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Status as StatusFreight } from './enum/freight.enum';
import { Status as StatusFreightRegistration } from './enum/freight-register.enum';
import { freightTaxCalc } from './helper/freight-tax-calc';
import { ResponseDto } from '../global/dto/response.dto';
import { SearchFreightDto } from './dto/search-freight.dto';

@Injectable()
export class FreightService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFreightDto: CreateFreightDto,
    userId: number,
  ): Promise<ResponseDto> {
    const parcialValue =
      createFreightDto.distance * createFreightDto.min_weight;
    const tax = freightTaxCalc(parcialValue, createFreightDto.distance);

    const updatedFreightInfo = {
      ...createFreightDto,
      status: StatusFreight.PENDING,
      value: parcialValue,
      tax: tax,
      total_value: parcialValue + tax,
    };

    const freight = await this.prisma.freight.create({
      data: updatedFreightInfo,
    });

    const freightRegister = await this.prisma.freightRegistration.create({
      data: {
        status_request: StatusFreight.PENDING,
        freight_id: freight.id,
        company_id: userId,
        delivery_person_id: null,
      },
    });

    return new ResponseDto(false, 'Freight created successfully', {
      freight,
      register: freightRegister,
    });
  }

  async listPending(searchFreightDto: SearchFreightDto): Promise<ResponseDto> {
    const { page, pageSize } = searchFreightDto;

    const offset = (page - 1) * pageSize;
    const allFreightsRegisters = await this.prisma.freightRegistration.findMany(
      {
        skip: offset,
        take: pageSize,
        where: {
          status_request: StatusFreightRegistration.PENDING,
        },
        select: {
          freight: true,
        },
        orderBy: {
          id: 'desc',
        },
      },
    );
    return new ResponseDto(false, '', allFreightsRegisters);
  }

  async findOne(id: number): Promise<ResponseDto> {
    const freight = await this.prisma.freight.findUnique({
      where: { id },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    return new ResponseDto(false, 'Freight successfully found', freight);
  }

  async update(
    updateFreightDto: UpdateFreightDto,
    userId: number,
  ): Promise<ResponseDto> {
    const freight = await this.prisma.freight.findUnique({
      where: { id: updateFreightDto.id },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    const freightRegister = await this.prisma.freightRegistration.findFirst({
      where: {
        company_id: userId,
        freight_id: freight.id,
      },
    });

    if (!freightRegister) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const parcialValue =
      updateFreightDto.distance * updateFreightDto.min_weight;
    const tax = freightTaxCalc(parcialValue, updateFreightDto.distance);

    const updatedFreight = await this.prisma.freight.update({
      where: {
        id: freight.id,
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

  async findAllUserProtocols(
    searchFreightDto: SearchFreightDto,
  ): Promise<ResponseDto> {
    const { page, pageSize } = searchFreightDto;

    const offset = (page - 1) * pageSize;
    const allFreightsRegisters = await this.prisma.freightRegistration.findMany(
      {
        skip: offset,
        take: pageSize,
        where: {
          status_request: StatusFreightRegistration.PENDING,
        },
        select: {
          freight: true,
        },
        orderBy: {
          id: 'desc',
        },
      },
    );
    return new ResponseDto(false, '', allFreightsRegisters);
  }
}
