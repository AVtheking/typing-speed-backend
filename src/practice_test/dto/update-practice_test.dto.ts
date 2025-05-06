import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateChapterDto,
  CreatePracticeTestDto,
} from './create-practice_test.dto';

export class UpdatePracticeTestDto extends PartialType(CreatePracticeTestDto) {
  @ApiProperty({
    description: 'Title of the practice test',
    example: 'Typing Speed Test',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the practice test',
    example: 'A test to measure your typing speed.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Combined title and description',
    example: 'Typing Speed Test - A test to measure your typing speed.',
  })
  @IsString()
  @IsDefined()
  titleAndDescription: string;

  @ApiProperty({
    description: 'Meta title for SEO',
    example: 'Typing Test',
  })
  @IsString()
  @IsDefined()
  metaTitle: string;

  @ApiProperty({
    description: 'Meta description for SEO',
    example: 'Measure your typing speed with this practice test.',
  })
  @IsString()
  @IsDefined()
  metaDescription: string;

  @IsString()
  @IsDefined()
  categoryId: string;

  @ApiProperty({
    description: 'Category name of the practice test',
    example: 'Typing Basics',
  })
  @IsString()
  @IsDefined()
  categoryName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Video tag for the practice test',
    example: 'video',
    required: false,
  })
  videoTag?: string | undefined;
  @ApiProperty({
    description: 'List of chapters included in the practice test',
    type: [CreateChapterDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterDto)
  chapters: CreateChapterDto[];
}
