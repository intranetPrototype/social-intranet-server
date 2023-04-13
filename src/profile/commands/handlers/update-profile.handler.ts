import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProfileCommand } from "../impl/update-profile.command";
import { ProfileRepository } from "src/profile/db";
import { Profile } from "src/profile/model";

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {

  constructor(
    private readonly profileRepository: ProfileRepository
  ) { }

  execute({ userId, updateProfileRequest }: UpdateProfileCommand): Promise<Profile> {
    return this.profileRepository.updateProfile(userId, updateProfileRequest);
  }

}