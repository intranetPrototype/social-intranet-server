import { IsNotEmpty, IsNumber } from "class-validator";

export class LogoutUserRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}