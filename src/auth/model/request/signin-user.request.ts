import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninUserRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}