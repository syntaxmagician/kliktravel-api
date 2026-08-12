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
import { DestinationsService } from './destinations.service';
import { CreateRegionDto, UpdateRegionDto } from './dto/destination.dto';

@ApiTags('Destinations')
@Controller()
export class DestinationsController {
  constructor(private service: DestinationsService) {}

  @Public()
  @Get('destinations')
  @ApiQuery({ name: 'locale', required: false, enum: ['id', 'en'] })
  @ApiOperation({ summary: 'List region destinations (frontend RegionDestination[])' })
  findAll(@Query('locale') locale?: string) {
    return this.service.findAllPublic(locale);
  }

  @Public()
  @Get('destinations/:slug')
  @ApiQuery({ name: 'locale', required: false, enum: ['id', 'en'] })
  findOne(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.service.findOnePublic(slug, locale);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/destinations')
  adminList() {
    return this.service.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/destinations/:id')
  adminOne(@Param('id') id: string) {
    return this.service.findOneAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/destinations')
  create(@Body() dto: CreateRegionDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/destinations/:id')
  update(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/destinations/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
