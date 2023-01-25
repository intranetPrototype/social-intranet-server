import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserPasswordRequest {
  @IsNotEmpty()
  @IsString()
  password: string;
}