import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ResponseDto } from '../global/dto/response.dto';
import { freightTaxCalc } from '../freight/helper/freight-tax-calc';
import { CreateFreightDto } from './dto/create-freight.dto';
import { Status as StatusFreight } from '../freight/enum/freight.enum';
import { Status as StatusFreightRegistration } from '../freight/enum/freight-register.enum';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { DeleteFreightDto } from './dto/delete-freight.dto';
import { ListMyFreightsDto } from './dto/list-my-freights.dto';

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

  async createFreight(
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

  async updateFreight(
    updateFreightDto: UpdateFreightDto,
    userId: number,
  ): Promise<ResponseDto> {
    const freightRegister = await this.prisma.freightRegistration.findFirst({
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

  async findOneFreight(id: number, userId: number): Promise<ResponseDto> {
    const freight = await this.prisma.freightRegistration.findFirst({
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

  async listMyFreights(listMyFreightsDto: ListMyFreightsDto, userId: number) {
    const { page, pageSize } = listMyFreightsDto;
    const offset = (page - 1) * pageSize;

    const freights = await this.prisma.freightRegistration.findMany({
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

  async requests(userId: number) {
    const freights = await this.prisma.freightRegistration.findMany({
      where: {
        company_id: userId,
        status_request: StatusFreightRegistration.REQUESTED,
      },
      include: {
        freight: true,
      },
    });

    return new ResponseDto(false, '', freights);
  }

  async acceptRequest(freightId: number, userId: number) {
    const freight = await this.prisma.freightRegistration.findFirst({
      where: {
        freight_id: freightId,
        company_id: userId,
      },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.freightRegistration.update({
      where: {
        id: freight.id,
      },
      data: {
        status_request: StatusFreightRegistration.APPROVED,
      },
    });

    return new ResponseDto(false, 'Request accepted successfully', null);
  }

  async deleteFreight(deleteFreightDto: DeleteFreightDto, userId: number) {
    const freight = await this.prisma.freightRegistration.findFirst({
      where: {
        freight_id: deleteFreightDto.freight_id,
        company_id: userId,
      },
    });

    if (!freight) {
      throw new HttpException('Freight not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.freightRegistration.delete({
      where: {
        id: freight.id,
      },
    });

    await this.prisma.freight.delete({
      where: {
        id: deleteFreightDto.freight_id,
      },
    });

    return new ResponseDto(false, 'Freight deleted successfully', null);
  }
}
