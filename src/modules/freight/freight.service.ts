import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FreightService {
  constructor(private prisma: PrismaService) {}
}
