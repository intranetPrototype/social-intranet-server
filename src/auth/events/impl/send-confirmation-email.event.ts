import { SendConfirmationEmailDto } from "src/auth/model";

export class SendConfirmationEmailEvent {

  constructor(
    public readonly email: string,
    public readonly token: string
  ) {}

}