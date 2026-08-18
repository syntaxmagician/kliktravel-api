import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class SubDestinationDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty({ description: 'Nama ID (atau name jika monolingual input)' })
  @IsString()
  nameId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateRegionDto {
  @ApiProperty({ example: 'indonesia', description: 'Stable key / frontend id' })
  @IsString()
  key!: string;

  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'from-[#E0F2FE] to-[#7DD3FC]' })
  @IsString()
  featuredImageGradient!: string;

  @ApiProperty()
  @IsString()
  nameId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiProperty()
  @IsString()
  subtitleId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitleEn?: string;

  @ApiPropertyOptional({ type: [SubDestinationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubDestinationDto)
  subDestinations?: SubDestinationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'Active', enum: ['Active', 'Draft', 'Nonaktif'] })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateRegionDto extends PartialType(CreateRegionDto) {}
