import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class VerifyOtpDto {
  @IsDefined()
  @ApiProperty({
    description: 'Email of the user',
    example: 'abc@gmail.com',
  })
  email: string;

  @IsDefined()
  @ApiProperty({
    description: 'OTP sent to the user',
    example: 123456,
  })
  otp: number;
}
