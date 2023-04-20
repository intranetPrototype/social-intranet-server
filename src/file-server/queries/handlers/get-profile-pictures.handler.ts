import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProfilePicturesQuery } from "../impl";
import { FileServerService } from "src/file-server/services/file-server.service";
import { GetProfilePicturesResponse } from "src/file-server/model";

@QueryHandler(GetProfilePicturesQuery)
export class GetProfilePicturesHandler implements IQueryHandler<GetProfilePicturesQuery> {

  constructor(
    private readonly fileServerService: FileServerService
  ) { }

  async execute({ searchProfilesUserIds }: GetProfilePicturesQuery): Promise<GetProfilePicturesResponse[]> {
    const getProfilePicturesResponse: GetProfilePicturesResponse[] = [];

    searchProfilesUserIds.map(async userId => {
      const profilePicture = await this.fileServerService.getFileFromFileServer(userId, 'profile-picture.jpg');

      getProfilePicturesResponse.push({ userId, profilePicture });
    });

    return getProfilePicturesResponse;
  }

}