import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateJourneyDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  durationDays!: number;

  @ApiProperty()
  @IsNumber()
  priceRaw!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  countriesCount?: number;

  @ApiProperty()
  @IsString()
  image!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageGradient?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiProperty({
    description:
      'Locale ID content: title, destination, subtitle, durationLabel, dates, airline, price, travelMonth, travelStyle, introHeading, introDescription, chapters, itinerary, highlights, accommodations, flights, inclusions, exclusions, faqs',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  contentId!: Record<string, unknown>;

  @ApiProperty({
    description: 'Locale EN content (same shape as contentId)',
    type: 'object',
    additionalProperties: true,
  })
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

export class UpdateJourneyDto extends PartialType(CreateJourneyDto) {}
