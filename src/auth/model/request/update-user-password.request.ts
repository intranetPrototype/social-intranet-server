import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserPasswordRequest {
  @ApiProperty({
    description: 'The new updated user password',
    default: 'updated-password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}