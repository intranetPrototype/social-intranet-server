import { UpdateUserEmailRequest } from "src/auth/model";

export class UpdateUserEmailCommand {

  constructor(
    readonly userId: number,
    readonly updateUserEmailRequest: UpdateUserEmailRequest
  ) { }

}