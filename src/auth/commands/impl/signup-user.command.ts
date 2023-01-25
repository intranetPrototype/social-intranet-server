import { SignupUserRequest } from "src/auth/model";

export class SignupUserCommand {

  constructor(readonly signupUserRequest: SignupUserRequest) { }

}