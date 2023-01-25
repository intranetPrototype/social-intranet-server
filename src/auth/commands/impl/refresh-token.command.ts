import { RefreshTokenRequest } from "src/auth/model";

export class RefreshTokenCommand {

  constructor(readonly refreshTokenRequest: RefreshTokenRequest) { }

}