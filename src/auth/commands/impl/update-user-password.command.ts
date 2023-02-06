import { UpdateUserPasswordRequest } from "src/auth/model";

export class UpdateUserPasswordCommand {

  constructor(
    readonly email: string,
    readonly updateUserPasswordRequest: UpdateUserPasswordRequest
  ) { }

}