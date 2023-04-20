import { StreamableFile } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class GetProfilePicturesResponse {
  @ApiProperty({
    description: 'UserId',
    default: 1
  })
  userId: number;

  @ApiProperty({
    description: 'Streamable file of user profile-picture'
  })
  profilePicture: StreamableFile
}