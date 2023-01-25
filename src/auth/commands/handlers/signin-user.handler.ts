import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException } from '@nestjs/common';
import { SigninUserCommand } from "../impl";
import { TokenService } from "src/auth/services/token.service";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { AuthRepository } from "src/auth/db";

@CommandHandler(SigninUserCommand)
export class SigninUserHandler implements ICommandHandler<SigninUserCommand> {

  constructor(
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ signinUserRequest }: SigninUserCommand): Promise<any> {
    const { email, password } = signinUserRequest;
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await this.bcryptService.compare(password, user.getHash());
    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.tokenService.getTokens(user.getId(), user.getEmail(), user.getRole());
    const hashedRefreshToken = await this.bcryptService.hashData(tokens.refresh_token);

    await this.authRepository.updateRefreshTokenHash(user.getId(), hashedRefreshToken);

    return tokens;
  }

}