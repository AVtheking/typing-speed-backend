import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'abc@gmail.com',
  })
  email: string;
}
