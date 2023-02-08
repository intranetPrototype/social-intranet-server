import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendUpdatePasswordMailRequest {
  @ApiProperty({
    description: 'Email of the user who wants to update password',
    default: 'update-password@email.de'
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}