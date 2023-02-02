import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class SignupUserRequest {
  @ApiProperty({
    description: 'Email of the registered user',
    default: 'new-user@email.de'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the registered user',
    default: 'password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}