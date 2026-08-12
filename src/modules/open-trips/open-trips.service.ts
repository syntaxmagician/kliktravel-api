import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppLocale, parseLocale, pickLocale } from '../../common/locale';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOpenTripDto, UpdateOpenTripDto } from './dto/open-trip.dto';

type OpenTripRow = {
  id: string;
  slug: string;
  featuredImage: string;
  gallery: Prisma.JsonValue | null;
  contentId: Prisma.JsonValue;
  contentEn: Prisma.JsonValue;
};

@Injectable()
export class OpenTripsService {
  constructor(private prisma: PrismaService) {}

  private mapPublic(row: OpenTripRow, locale: AppLocale) {
    const content = pickLocale(
      locale,
      row.contentId,
      row.contentEn,
    ) as Record<string, unknown>;

    return {
      slug: row.slug,
      featuredImage: row.featuredImage,
      gallery: (row.gallery as string[] | null) ?? undefined,
      ...content,
    };
  }

  async findAllPublic(localeRaw?: string) {
    const locale = parseLocale(localeRaw);
    const rows = await this.prisma.openTrip.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((r) => this.mapPublic(r, locale));
  }

  async findOnePublic(slug: string, localeRaw?: string) {
    const locale = parseLocale(localeRaw);
    const row = await this.prisma.openTrip.findFirst({
      where: { slug, isPublished: true },
    });
    if (!row) throw new NotFoundException('Open trip not found');
    return this.mapPublic(row, locale);
  }

  findAllAdmin() {
    return this.prisma.openTrip.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.openTrip.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Open trip not found');
    return row;
  }

  async create(dto: CreateOpenTripDto) {
    const exists = await this.prisma.openTrip.findUnique({
      where: { slug: dto.slug },
    });
    if (exists) throw new ConflictException('Slug sudah dipakai');

    return this.prisma.openTrip.create({
      data: {
        slug: dto.slug,
        featuredImage: dto.featuredImage,
        gallery: dto.gallery ?? Prisma.JsonNull,
        contentId: dto.contentId as Prisma.InputJsonValue,
        contentEn: dto.contentEn as Prisma.InputJsonValue,
        sortOrder: dto.sortOrder ?? 0,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateOpenTripDto) {
    await this.findOneAdmin(id);
    if (dto.slug) {
      const conflict = await this.prisma.openTrip.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (conflict) throw new ConflictException('Slug sudah dipakai');
    }

    return this.prisma.openTrip.update({
      where: { id },
      data: {
        slug: dto.slug,
        featuredImage: dto.featuredImage,
        gallery:
          dto.gallery === undefined
            ? undefined
            : ((dto.gallery ?? Prisma.JsonNull) as Prisma.InputJsonValue),
        contentId: dto.contentId as Prisma.InputJsonValue | undefined,
        contentEn: dto.contentEn as Prisma.InputJsonValue | undefined,
        sortOrder: dto.sortOrder,
        isPublished: dto.isPublished,
      },
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    await this.prisma.openTrip.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
