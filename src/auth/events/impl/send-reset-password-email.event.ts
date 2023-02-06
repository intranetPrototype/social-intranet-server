import { SendConfirmationEmailDto } from "src/auth/model";

export class SendResetPasswordEmailEvent {

  constructor(
    public readonly email: string,
    public readonly token: string
  ) {}

}