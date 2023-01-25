import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  userId: number;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}