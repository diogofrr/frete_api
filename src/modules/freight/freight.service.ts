import { Injectable } from '@nestjs/common';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FreightService {
  constructor(private prisma: PrismaService) {}

  async create(createFreightDto: CreateFreightDto) {
    // const freight = await this.prisma.freight.create({
    //   data: createFreightDto,
    // });
  }

  findAll() {
    return `This action returns all freight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} freight`;
  }

  update(id: number, updateFreightDto: UpdateFreightDto) {
    return `This action updates a #${id} freight`;
  }

  remove(id: number) {
    return `This action removes a #${id} freight`;
  }
}
