import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalService } from './journal.service';

@ApiTags('Journal')
@Controller()
export class JournalController {
  constructor(private service: JournalService) {}

  @Public()
  @Get('journal')
  @ApiOperation({ summary: 'List journal articles (frontend JournalArticle[])' })
  findAll() {
    return this.service.findAllPublic();
  }

  @Public()
  @Get('journal/:slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findOnePublic(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/journal')
  adminList() {
    return this.service.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/journal/:id')
  adminOne(@Param('id') id: string) {
    return this.service.findOneAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('admin/journal')
  create(@Body() dto: CreateJournalDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/journal/:id')
  update(@Param('id') id: string, @Body() dto: UpdateJournalDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/journal/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
