import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadCoverPhotoCommand } from "../impl";
import { ProfileRepository } from "src/profile/db";
import { Profile } from "src/profile/model";
import { FileServerService } from "src/file-server/services/file-server.service";

@CommandHandler(UploadCoverPhotoCommand)
export class UploadCoverPhotoHandler implements ICommandHandler<UploadCoverPhotoCommand> {

  constructor(
    private readonly fileServerService: FileServerService,
    private readonly profileRepository: ProfileRepository
  ) { }

  execute({ userId, coverPhoto }: UploadCoverPhotoCommand): Promise<Profile> {
    const coverPhotoPath = this.fileServerService.saveFile(userId, 'cover-photo', coverPhoto);

    return this.profileRepository.uploadCoverPhoto(userId, coverPhotoPath);
  }

}