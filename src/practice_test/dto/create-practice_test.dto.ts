import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Difficulty {
  Basic = 'Basic',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

enum Layout {
  BoxLayout = 'BoxLayout',
  LineLayout = 'LineLayout',
}

export class CreateChapterDto {
  @ApiProperty({
    description: 'Title of the chapter',
    example: 'Chapter 1: Introduction',
  })
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({
    description: 'Embedded code of the chapter',
    example: 'j j j j a a a',
  })
  @IsString()
  @IsDefined()
  embedCode: string;

  @ApiProperty({
    description: 'Layout type for the chapter',
    enum: Layout,
    example: Layout.BoxLayout,
  })
  @IsEnum(Layout)
  layout: Layout;
}

export class CreatePracticeTestDto {
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

  @ApiProperty({
    description: 'Difficulty level of the practice test',
    enum: Difficulty,
    example: Difficulty.Beginner,
  })
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
    example: 'video-tag',
    required: false,
  })
  videoTag: string;

  @ApiProperty({
    description: 'List of chapters included in the practice test',
    type: [CreateChapterDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterDto)
  chapters: CreateChapterDto[];
}
