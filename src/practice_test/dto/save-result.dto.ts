import { IsArray, IsNumber, IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveTestResultDto {
  @ApiProperty({
    description: 'ID of the practice test being submitted',
    example: 'test12345',
  })
  @IsString()
  @IsDefined()
  practiceTestId: string;

  @ApiProperty({
    description: 'Words per minute (WPM) of the user',
    example: 48,
  })
  @IsNumber()
  wpm: number;

  @ApiProperty({
    description: 'Typing accuracy in percentage',
    example: 99,
  })
  @IsNumber()
  accuracy: number;

  @ApiProperty({
    description: 'Time taken for the test in seconds',
    example: 15,
  })
  @IsNumber()
  time: number;

  @ApiProperty({
    description: 'Raw typing speed',
    example: 15,
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

  @ApiProperty({
    description: 'List of key press stats with difficulty scores',
    type: Array,
    example: [
      { key: 'A', difficultyScore: 10 },
      { key: 'S', difficultyScore: 15 },
    ],
  })
  @IsArray()
  keyPressStats: {
    key: string;
    difficultyScore: number;
  }[];
}
