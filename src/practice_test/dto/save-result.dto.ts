import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SaveResultDto } from 'src/save-test-result.dto';

export class SavePracticeTestResultDto extends SaveResultDto {
  @ApiProperty({
    description: 'Time taken for the test in seconds',
    example: 15,
  })
  @IsNumber()
  time: number;

  @ApiProperty({
    description: 'List of key press stats with difficulty scores',
    type: Array,
    example: [
      { key: 'A', difficultyScore: 10 },
      { key: 'S', difficultyScore: 15 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  keyPressStats: {
    key: string;
    difficultyScore: number;
  }[];
}
