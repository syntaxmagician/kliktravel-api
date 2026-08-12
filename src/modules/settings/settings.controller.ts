import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { IsObject, IsString } from 'class-validator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PrismaService } from '../../prisma/prisma.service';

class UpsertSettingDto {
  @ApiProperty()
  @IsString()
  key!: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  value!: Prisma.InputJsonValue;
}

const PUBLIC_KEYS = ['siteName', 'whatsapp', 'email', 'instagram'];

@ApiTags('Settings')
@Controller()
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get('settings/public')
  @ApiOperation({ summary: 'Settings publik untuk storefront' })
  async publicSettings() {
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/settings')
  findAll() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Put('admin/settings')
  @ApiOperation({ summary: 'Upsert setting key/value JSON' })
  upsert(@Body() dto: UpsertSettingDto) {
    return this.prisma.setting.upsert({
      where: { key: dto.key },
      create: { key: dto.key, value: dto.value },
      update: { value: dto.value },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/settings/:key')
  findOne(@Param('key') key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }
}
