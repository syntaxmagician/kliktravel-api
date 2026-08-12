import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJournalDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  image!: string;

  @ApiProperty()
  @IsString()
  categoryID!: string;

  @ApiProperty()
  @IsString()
  categoryEN!: string;

  @ApiProperty()
  @IsString()
  titleID!: string;

  @ApiProperty()
  @IsString()
  titleEN!: string;

  @ApiProperty()
  @IsString()
  excerptID!: string;

  @ApiProperty()
  @IsString()
  excerptEN!: string;

  @ApiProperty()
  @IsString()
  contentID!: string;

  @ApiProperty()
  @IsString()
  contentEN!: string;

  @ApiProperty()
  @IsString()
  dateID!: string;

  @ApiProperty()
  @IsString()
  dateEN!: string;

  @ApiProperty()
  @IsString()
  readTimeID!: string;

  @ApiProperty()
  @IsString()
  readTimeEN!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateJournalDto extends PartialType(CreateJournalDto) {}
