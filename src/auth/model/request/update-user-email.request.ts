import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserEmailRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}