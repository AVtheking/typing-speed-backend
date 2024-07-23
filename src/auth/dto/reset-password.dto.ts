import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsDefined()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must have one uppercase letter, one lowercase letter, one number or special character, and at least 8 characters long',
  })
  @ApiProperty({
    description: 'New password of the user',
    example: 'Qwerty@123',
  })
  password: string;
}
