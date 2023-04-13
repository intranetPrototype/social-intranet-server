import { IsNotEmpty, IsOptional } from "class-validator";
import { UpdateProfileDto, UpdateProfileUserDto } from "../dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileRequest {
  @ApiProperty({
    description: 'User'
  })
  @IsNotEmpty()
  user: UpdateProfileUserDto;

  @ApiProperty({
    description: 'Profile'
  })
  @IsOptional()
  profile: UpdateProfileDto;
}
