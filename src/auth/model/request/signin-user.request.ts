import { ApiProperty } from "@nestjs/swagger/dist";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninUserRequest {
  @ApiProperty({
    description: 'Email of the user who wants to signin',
    default: 'signin-user@email.de'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user who wants to signin',
    default: 'password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}