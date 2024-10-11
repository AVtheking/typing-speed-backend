import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Typing Basics',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'This category covers the basics of typing.',
  })
  @IsString()
  @IsDefined()
  description: string;

  @ApiProperty({
    description: 'Meta title for SEO purposes (optional)',
    example: 'Learn Typing Basics',
    required: false,
  })
  @IsString()
  @IsOptional()
  metaTitle: string;

  @ApiProperty({
    description: 'Meta description for SEO purposes (optional)',
    example:
      'This category helps users learn the basics of typing efficiently.',
    required: false,
  })
  @IsString()
  @IsOptional()
  metaDescription: string;

  @ApiProperty({
    description: 'Meta keywords for SEO purposes (optional)',
    example: 'typing, basics, beginner, typing speed',
    required: false,
  })
  @IsString()
  @IsOptional()
  metaKeywords: string;
}
