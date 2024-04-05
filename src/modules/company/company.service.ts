import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
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

    return company;
  }

  async findOne(id: number) {
    const company = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    return company;
  }

  async remove(id: number) {
    const company = await this.prisma.company.delete({
      where: {
        id,
      },
    });

    if (!company) {
      throw new HttpException('Company does not exists', HttpStatus.NOT_FOUND);
    }
  }
}
