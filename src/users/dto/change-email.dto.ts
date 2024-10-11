import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    description: 'The new email address',
    example: ' [email protected]',
  })
  @IsEmail()
  email: string;
}
