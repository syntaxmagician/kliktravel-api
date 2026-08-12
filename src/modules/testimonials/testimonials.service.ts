import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  findAllPublic() {
    return this.prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        role: true,
        rating: true,
        reviewID: true,
        reviewEN: true,
        trip: true,
        approved: true,
      },
    });
  }

  findAllAdmin() {
    return this.prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Testimonial not found');
    return row;
  }

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        ...dto,
        approved: dto.approved ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.findOneAdmin(id);
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    await this.prisma.testimonial.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
