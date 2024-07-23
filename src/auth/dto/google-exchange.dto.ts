import { ApiProperty } from '@nestjs/swagger';

export class GoogleTokenExchangeDto {
  @ApiProperty({
    description: 'The access token provided by Google',
    example: 'your-google-access-token',
  })
  access_token: string;
}
