import { ApiProperty } from "@nestjs/swagger";

export class GetProfilePicturesRequest {
  @ApiProperty({
    description: 'UserIds of search profiles',
    default: [1, 2]
  })
  profilePictureUserIds: number[];
}