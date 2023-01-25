import { ApiProperty } from "@nestjs/swagger";

export class Tokens {
  @ApiProperty({
    description: 'User access-token',
    default: 'access-token'
  })
  access_token: string;

  @ApiProperty({
    description: 'User refresh-token to get new access-token if expired',
    default: 'refresh-token'
  })
  refresh_token: string;
}