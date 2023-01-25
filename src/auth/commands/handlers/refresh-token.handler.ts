import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthRepository } from "src/auth/db";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { TokenService } from "src/auth/services/token.service";
import { RefreshTokenCommand } from "../impl";
import { Tokens } from "src/auth/types";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {

  constructor(
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ refreshTokenRequest }: RefreshTokenCommand): Promise<Tokens> {
    const { userId, refreshToken } = refreshTokenRequest;
    const user = await this.authRepository.findUserById(userId);

    if (!user.getHashedRt()) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await this.bcryptService.compare(refreshToken, user.getHashedRt());
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.tokenService.getTokens(user.getId(), user.getEmail(), user.getRole());
    const refreshTokenHashed = await this.bcryptService.hashData(tokens.refresh_token);
    this.authRepository.updateRefreshTokenHash(user.getId(), refreshTokenHashed);

    return tokens;
  }

}