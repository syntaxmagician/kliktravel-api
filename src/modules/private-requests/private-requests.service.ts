import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePrivateTripDto,
  UpdatePrivateTripDto,
} from './dto/private-request.dto';

@Injectable()
export class PrivateRequestsService {
  constructor(private prisma: PrismaService) {}

  private map(row: {
    id: string;
    name: string;
    phone: string;
    destination: string;
    dates: string;
    guests: string;
    budget: string | null;
    notes: string | null;
    status: string;
    createdAt: Date;
  }) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      destination: row.destination,
      dates: row.dates,
      guests: row.guests,
      budget: row.budget ?? '',
      notes: row.notes ?? '',
      status: row.status.toLowerCase() as 'new' | 'contacted' | 'closed',
      createdAt: row.createdAt,
    };
  }

  create(dto: CreatePrivateTripDto) {
    return this.prisma.privateTripRequest
      .create({ data: dto })
      .then((r) => this.map(r));
  }

  async findAllAdmin() {
    const rows = await this.prisma.privateTripRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.map(r));
  }

  async update(id: string, dto: UpdatePrivateTripDto) {
    const exists = await this.prisma.privateTripRequest.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Inquiry not found');
    const row = await this.prisma.privateTripRequest.update({
      where: { id },
      data: dto,
    });
    return this.map(row);
  }

  async remove(id: string) {
    const exists = await this.prisma.privateTripRequest.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Inquiry not found');
    await this.prisma.privateTripRequest.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
