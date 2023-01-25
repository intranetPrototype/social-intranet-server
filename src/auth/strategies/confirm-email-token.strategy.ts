import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class ConfirmEmailTokenStrategy extends PassportStrategy(Strategy, 'jwt-confirm-email') {

  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('CONFIRM_TOKEN_SECRET'),
    });
  }

  validate(payload: any): any {
    return payload;
  }

}