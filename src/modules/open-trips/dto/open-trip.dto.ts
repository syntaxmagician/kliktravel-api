import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOpenTripDto {
  @ApiProperty({ example: 'tokyo' })
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  featuredImage!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiProperty({
    description:
      'Locale ID: name, tagline, duration, price, hotelRating, highlights, itinerary, inclusions, exclusions',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  contentId!: Record<string, unknown>;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  contentEn!: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateOpenTripDto extends PartialType(CreateOpenTripDto) {}
