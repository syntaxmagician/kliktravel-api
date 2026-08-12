import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrivateTripStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePrivateTripDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty()
  @IsString()
  destination!: string;

  @ApiProperty({ example: '15 — 20 Okt 2026' })
  @IsString()
  dates!: string;

  @ApiProperty({ example: '8 Adults, 2 Children' })
  @IsString()
  guests!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePrivateTripDto {
  @ApiPropertyOptional({ enum: PrivateTripStatus })
  @IsOptional()
  @IsEnum(PrivateTripStatus)
  status?: PrivateTripStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dates?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guests?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
