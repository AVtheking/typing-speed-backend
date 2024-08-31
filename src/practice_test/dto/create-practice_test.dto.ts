import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
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
    description: 'Description of the chapter',
    example: 'This chapter covers the basics of typing.',
  })
  @IsString()
  @IsDefined()
  description: string;

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
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({
    description: 'List of chapters included in the practice test',
    type: [CreateChapterDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterDto)
  chapters: CreateChapterDto[];
}
