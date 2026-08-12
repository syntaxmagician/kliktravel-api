import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  private mapPublic(row: {
    slug: string;
    image: string;
    categoryID: string;
    categoryEN: string;
    titleID: string;
    titleEN: string;
    excerptID: string;
    excerptEN: string;
    contentID: string;
    contentEN: string;
    dateID: string;
    dateEN: string;
    readTimeID: string;
    readTimeEN: string;
    featured: boolean;
    gallery: Prisma.JsonValue | null;
  }) {
    return {
      slug: row.slug,
      image: row.image,
      categoryID: row.categoryID,
      categoryEN: row.categoryEN,
      titleID: row.titleID,
      titleEN: row.titleEN,
      excerptID: row.excerptID,
      excerptEN: row.excerptEN,
      contentID: row.contentID,
      contentEN: row.contentEN,
      dateID: row.dateID,
      dateEN: row.dateEN,
      readTimeID: row.readTimeID,
      readTimeEN: row.readTimeEN,
      featured: row.featured,
      gallery: (row.gallery as string[] | null) ?? undefined,
    };
  }

  async findAllPublic() {
    const rows = await this.prisma.journalArticle.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    });
    return rows.map((r) => this.mapPublic(r));
  }

  async findOnePublic(slug: string) {
    const row = await this.prisma.journalArticle.findFirst({
      where: { slug, isPublished: true },
    });
    if (!row) throw new NotFoundException('Journal article not found');
    return this.mapPublic(row);
  }

  findAllAdmin() {
    return this.prisma.journalArticle.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.journalArticle.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Journal article not found');
    return row;
  }

  async create(dto: CreateJournalDto) {
    const exists = await this.prisma.journalArticle.findUnique({
      where: { slug: dto.slug },
    });
    if (exists) throw new ConflictException('Slug sudah dipakai');

    return this.prisma.journalArticle.create({
      data: {
        ...dto,
        gallery: dto.gallery ?? Prisma.JsonNull,
        featured: dto.featured ?? false,
        sortOrder: dto.sortOrder ?? 0,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateJournalDto) {
    await this.findOneAdmin(id);
    if (dto.slug) {
      const conflict = await this.prisma.journalArticle.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (conflict) throw new ConflictException('Slug sudah dipakai');
    }

    return this.prisma.journalArticle.update({
      where: { id },
      data: {
        ...dto,
        gallery:
          dto.gallery === undefined
            ? undefined
            : ((dto.gallery ?? Prisma.JsonNull) as Prisma.InputJsonValue),
      },
    });
  }

  async remove(id: string) {
    await this.findOneAdmin(id);
    await this.prisma.journalArticle.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
