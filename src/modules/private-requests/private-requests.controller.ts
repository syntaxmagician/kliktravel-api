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
import {
  CreatePrivateTripDto,
  UpdatePrivateTripDto,
} from './dto/private-request.dto';
import { PrivateRequestsService } from './private-requests.service';

@ApiTags('Private Trip Requests')
@Controller()
export class PrivateRequestsController {
  constructor(private service: PrivateRequestsService) {}

  @Public()
  @Post('private-trip-requests')
  @ApiOperation({ summary: 'Submit private trip inquiry' })
  create(@Body() dto: CreatePrivateTripDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/private-trips')
  adminList() {
    return this.service.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/private-trips/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePrivateTripDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete('admin/private-trips/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
