import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserEmailRequest {
  @ApiProperty({
    description: 'The new updated user email',
    default: 'updated-email@email.de'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}