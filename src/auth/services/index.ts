import { BcryptService } from "./bcrypt.service";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";

export const AuthServices = [
  BcryptService,
  MailService,
  TokenService
];