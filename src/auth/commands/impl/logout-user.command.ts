import { LogoutUserRequest } from "src/auth/model";

export class LogoutUserCommand {

  constructor(readonly logoutUserRequest: LogoutUserRequest) { }

}