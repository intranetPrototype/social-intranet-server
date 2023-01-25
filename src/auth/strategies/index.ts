import { AccessTokenStrategy } from "./access-token.strategy";
import { ConfirmEmailTokenStrategy } from "./confirm-email-token.strategy";
import { RefreshTokenStrategy } from "./refresh-token.strategy";

export const AuthStrategies = [
  AccessTokenStrategy,
  ConfirmEmailTokenStrategy,
  RefreshTokenStrategy
];