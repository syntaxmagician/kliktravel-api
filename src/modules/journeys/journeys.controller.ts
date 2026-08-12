import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateJourneyDto, UpdateJourneyDto } from './dto/journey.dto';
import { JourneysService } from './journeys.service';

@ApiTags('Journeys')
@Controller()
export class JourneysController {
  constructor(private service: JourneysService) {}

  @Public()
  @Get('journeys')
  @ApiQuery({ name: 'locale', required: false, enum: ['id', 'en'] })
  @ApiOperation({ summary: 'List curated journeys (frontend Journey[])' })
  findAll(@Query('locale') locale?: string) {
    return this.service.findAllPublic(locale);
  }

  @Public()
  @Get('journeys/:slug')
  @ApiQuery({ name: 'locale', required: false, enum: ['id', 'en'] })
  findOne(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.service.findOnePublic(slug, locale);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/journeys')
  adminList() {
    return this.service.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/journeys/:id')
  adminOne(@Param('id') id: string) {
    return this.service.findOneAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/journeys')
  create(@Body() dto: CreateJourneyDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/journeys/:id')
  update(@Param('id') id: string, @Body() dto: UpdateJourneyDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/journeys/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
