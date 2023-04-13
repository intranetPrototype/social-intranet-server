import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadProfilePictureCommand } from "../impl";
import { ProfileRepository } from "src/profile/db";
import { Profile } from "src/profile/model";
import { FileServerService } from "src/file-server/services/file-server.service";

@CommandHandler(UploadProfilePictureCommand)
export class UploadProfilePictureHandler implements ICommandHandler<UploadProfilePictureCommand> {

  constructor(
    private readonly fileServerService: FileServerService,
    private readonly profileRepository: ProfileRepository
  ) { }

  execute({ userId, profilePicture }: UploadProfilePictureCommand): Promise<Profile> {
    const profilePicturePath = this.fileServerService.saveFile(userId, 'profile-picture', profilePicture);

    return this.profileRepository.uploadProfilePicture(userId, profilePicturePath);
  }

}