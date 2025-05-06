import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SaveResultDto } from 'src/save-test-result.dto';

export enum Mode {
  FifteenSeconds = '15s',
  ThirtySeconds = '30s',
  SixtySeconds = '60s',
}
export class SaveTestResultDto extends SaveResultDto {
  @ApiProperty({
    description: 'Mode of the test (e.g., 15s, 30s, 60s)',
    example: '15s',
    enum: Mode, // Specifies allowed values in Swagger documentation
  })
  @IsEnum(Mode)
  mode: Mode;
}
