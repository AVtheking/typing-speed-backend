import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SaveResultDto {
  @ApiProperty({
    description: 'Words per minute (WPM) of the user',
    example: 48,
  })
  @IsNumber()
  wpm: number;

  @ApiProperty({
    description: 'Typing accuracy in percentage',
    example: 0.99,
  })
  @IsNumber()
  accuracy: number;

  @ApiProperty({
    description: 'Raw typing speed',
    example: 60,
  })
  @IsNumber()
  raw: number;

  @ApiProperty({
    description: 'Number of correct characters typed',
    example: 50,
  })
  @IsNumber()
  correct: number;

  @ApiProperty({
    description: 'Number of incorrect characters typed',
    example: 2,
  })
  @IsNumber()
  incorrect: number;

  @ApiProperty({
    description: 'Number of extra characters typed',
    example: 4,
  })
  @IsNumber()
  extras: number;

  @ApiProperty({
    description: 'Number of characters missed',
    example: 0,
  })
  @IsNumber()
  missed: number;
}
