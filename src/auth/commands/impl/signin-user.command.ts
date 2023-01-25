import { SigninUserRequest } from "src/auth/model";

export class SigninUserCommand {

  constructor(readonly signinUserRequest: SigninUserRequest) { }

}