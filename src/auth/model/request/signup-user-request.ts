import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class SignupUserRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}