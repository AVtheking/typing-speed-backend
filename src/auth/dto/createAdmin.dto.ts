import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdminDto {
  @IsEmail()
  @IsDefined()
  @ApiProperty({
    description: 'Email of the admin',
    example: 'abc@gmail.com',
  })
  email: string;

  @IsDefined()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({
    description: 'Password of the user',
    example: 'Qwerty@123',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must have one uppercase letter, one lowercase letter, one number or special character, and at least 8 characters long',
  })
  password: string;
}
