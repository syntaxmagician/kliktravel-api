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
import { CreateOpenTripDto, UpdateOpenTripDto } from './dto/open-trip.dto';
import { OpenTripsService } from './open-trips.service';

@ApiTags('Open Trips')
@Controller()
export class OpenTripsController {
  constructor(private service: OpenTripsService) {}

  @Public()
  @Get('open-trips')
  @ApiQuery({ name: 'locale', required: false, enum: ['id', 'en'] })
  @ApiOperation({
    summary: 'List open trips / tour packages (frontend TourPackageDetail)',
  })
  findAll(@Query('locale') locale?: string) {
    return this.service.findAllPublic(locale);
  }

  @Public()
  @Get('open-trips/:slug')
  @ApiQuery({ name: 'locale', required: false, enum: ['id', 'en'] })
  findOne(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.service.findOnePublic(slug, locale);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/open-trips')
  adminList() {
    return this.service.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/open-trips/:id')
  adminOne(@Param('id') id: string) {
    return this.service.findOneAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/open-trips')
  create(@Body() dto: CreateOpenTripDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/open-trips/:id')
  update(@Param('id') id: string, @Body() dto: UpdateOpenTripDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/open-trips/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
