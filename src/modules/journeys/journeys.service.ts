import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppLocale, parseLocale, pickLocale } from '../../common/locale';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJourneyDto, UpdateJourneyDto } from './dto/journey.dto';

type JourneyRow = {
  id: string;
  slug: string;
  durationDays: number;
  priceRaw: Prisma.Decimal;
  countriesCount: number;
  image: string;
  imageGradient: string | null;
  gallery: Prisma.JsonValue | null;
  contentId: Prisma.JsonValue;
  contentEn: Prisma.JsonValue;
};

@Injectable()
export class JourneysService {
  constructor(private prisma: PrismaService) {}

  private mapPublic(row: JourneyRow, locale: AppLocale) {
    const content = pickLocale(
      locale,
      row.contentId,
      row.contentEn,
    ) as Record<string, unknown>;

    return {
      id: row.id,
      slug: row.slug,
      durationDays: row.durationDays,
      priceRaw: Number(row.priceRaw),
      countriesCount: row.countriesCount,
      image: row.image,
      imageGradient: row.imageGradient ?? undefined,
      gallery: (row.gallery as string[] | null) ?? undefined,
      ...content,
    };
  }

  async findAllPublic(localeRaw?: string) {
    const locale = parseLocale(localeRaw);
    const rows = await this.prisma.journey.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((r) => this.mapPublic(r, locale));
  }

  async findOnePublic(slug: string, localeRaw?: string) {
    const locale = parseLocale(localeRaw);
    const row = await this.prisma.journey.findFirst({
      where: { slug, isPublished: true },
    });
    if (!row) throw new NotFoundException('Journey not found');
    return this.mapPublic(row, locale);
  }

  findAllAdmin() {
    return this.prisma.journey.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.journey.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Journey not found');
    return row;
  }

  async create(dto: CreateJourneyDto) {
    const exists = await this.prisma.journey.findUnique({
      where: { slug: dto.slug },
    });
    if (exists) throw new ConflictException('Slug sudah dipakai');

    return this.prisma.journey.create({
      data: {
        slug: dto.slug,
        durationDays: dto.durationDays,
        priceRaw: dto.priceRaw,
        countriesCount: dto.countriesCount ?? 1,
        image: dto.image,
        imageGradient: dto.imageGradient,
        gallery: dto.gallery ?? Prisma.JsonNull,
        contentId: dto.contentId as Prisma.InputJsonValue,
        contentEn: dto.contentEn as Prisma.InputJsonValue,
        sortOrder: dto.sortOrder ?? 0,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateJourneyDto) {
    await this.findOneAdmin(id);
    if (dto.slug) {
      const conflict = await this.prisma.journey.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (conflict) throw new ConflictException('Slug sudah dipakai');
    }

    return this.prisma.journey.update({
      where: { id },
      data: {
        slug: dto.slug,
        durationDays: dto.durationDays,
        priceRaw: dto.priceRaw,
        countriesCount: dto.countriesCount,
        image: dto.image,
        imageGradient: dto.imageGradient,
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
    await this.prisma.journey.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
