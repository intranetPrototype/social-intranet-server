import { UpdateUserPasswordRequest } from "src/auth/model";

export class UpdateUserPasswordCommand {

  constructor(
    readonly userId: number,
    readonly updateUserPasswordRequest: UpdateUserPasswordRequest
  ) { }

}