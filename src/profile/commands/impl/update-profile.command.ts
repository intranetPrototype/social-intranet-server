import { UpdateProfileRequest } from "src/profile/model";

export class UpdateProfileCommand {

  constructor(
    readonly userId: number,
    readonly updateProfileRequest: UpdateProfileRequest
  ) { }

}