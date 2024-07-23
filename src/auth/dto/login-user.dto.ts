import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'abc@gmail.com',
  })
  email: string;

  @IsDefined()
  @ApiProperty({
    description: 'Password of the user',
    example: 'Qwerty@123',
  })
  password: string;
}
