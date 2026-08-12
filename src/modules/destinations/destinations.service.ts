import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppLocale, parseLocale, pickLocale } from '../../common/locale';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRegionDto, UpdateRegionDto } from './dto/destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  private mapRegion(
    region: {
      id: string;
      key: string;
      slug: string;
      featuredImageGradient: string;
      nameId: string;
      nameEn: string;
      subtitleId: string;
      subtitleEn: string;
      subDestinations: {
        nameId: string;
        nameEn: string;
        slug: string;
        sortOrder: number;
      }[];
    },
    locale: AppLocale,
  ) {
    return {
      id: region.key,
      name: pickLocale(locale, region.nameId, region.nameEn),
      slug: region.slug,
      subtitle: pickLocale(locale, region.subtitleId, region.subtitleEn),
      featuredImageGradient: region.featuredImageGradient,
      subDestinations: [...region.subDestinations]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          name: pickLocale(locale, s.nameId, s.nameEn),
          slug: s.slug,
        })),
    };
  }

  async findAllPublic(localeRaw?: string) {
    const locale = parseLocale(localeRaw);
    const rows = await this.prisma.region.findMany({
      where: { isActive: true },
      include: { subDestinations: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((r) => this.mapRegion(r, locale));
  }

  async findOnePublic(slug: string, localeRaw?: string) {
    const locale = parseLocale(localeRaw);
    const row = await this.prisma.region.findFirst({
      where: { slug, isActive: true },
      include: { subDestinations: true },
    });
    if (!row) throw new NotFoundException('Destination not found');
    return this.mapRegion(row, locale);
  }

  findAllAdmin() {
    return this.prisma.region.findMany({
      include: { subDestinations: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.region.findUnique({
      where: { id },
      include: { subDestinations: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!row) throw new NotFoundException('Destination not found');
    return row;
  }

  async create(dto: CreateRegionDto) {
    const exists = await this.prisma.region.findFirst({
      where: { OR: [{ key: dto.key }, { slug: dto.slug }] },
    });
    if (exists) throw new ConflictException('Key atau slug sudah dipakai');

    return this.prisma.region.create({
      data: {
        key: dto.key,
        slug: dto.slug,
        featuredImageGradient: dto.featuredImageGradient,
        nameId: dto.nameId,
        nameEn: dto.nameEn ?? dto.nameId,
        subtitleId: dto.subtitleId,
        subtitleEn: dto.subtitleEn ?? dto.subtitleId,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        subDestinations: dto.subDestinations?.length
          ? {
              create: dto.subDestinations.map((s, i) => ({
                slug: s.slug,
                nameId: s.nameId,
                nameEn: s.nameEn ?? s.nameId,
                sortOrder: s.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: { subDestinations: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async update(id: string, dto: UpdateRegionDto) {
    await this.findOneAdmin(id);

    if (dto.key || dto.slug) {
      const conflict = await this.prisma.region.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(dto.key ? [{ key: dto.key }] : []),
            ...(dto.slug ? [{ slug: dto.slug }] : []),
          ],
        },
      });
      if (conflict) throw new ConflictException('Key atau slug sudah dipakai');
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.subDestinations) {
        await tx.subDestination.deleteMany({ where: { regionId: id } });
        await tx.subDestination.createMany({
          data: dto.subDestinations.map((s, i) => ({
            regionId: id,
            slug: s.slug,
            nameId: s.nameId,
            nameEn: s.nameEn ?? s.nameId,
            sortOrder: s.sortOrder ?? i,
          })),
        });
      }

      return tx.region.update({
        where: { id },
        data: {
          key: dto.key,
          slug: dto.slug,
          featuredImageGradient: dto.featuredImageGradient,
          nameId: dto.nameId,
          nameEn: dto.nameEn,
          subtitleId: dto.subtitleId,
          subtitleEn: dto.subtitleEn,
          sortOrder: dto.sortOrder,
          isActive: dto.isActive,
        },
        include: { subDestinations: { orderBy: { sortOrder: 'asc' } } },
      });
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    await this.prisma.region.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
