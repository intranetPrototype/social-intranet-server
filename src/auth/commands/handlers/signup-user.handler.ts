import { ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs/dist";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "src/auth/db";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { TokenService } from "src/auth/services/token.service";
import { Tokens } from "src/auth/types";
import { SignupUserCommand } from "../impl";
import { MailService } from "src/auth/services/mail.service";

@CommandHandler(SignupUserCommand)
export class SignupUserHandler implements ICommandHandler<SignupUserCommand> {

  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository,
  ) { }

  async execute({ signupUserRequest }: SignupUserCommand): Promise<Tokens> {
    const { firstName, lastName, email, password } = signupUserRequest;
    const hash = await this.bcryptService.hashData(password);

    const user = await this.authRepository.signupUser({
      firstName,
      lastName,
      email,
      hash,
      hashedRt: null,
      role: [UserRole.STANDARD]
    });

    const tokens = await this.tokenService.getTokens(user.getId(), user.getEmail(), user.getRole());
    const hashedRefreshToken = await this.bcryptService.hashData(tokens.refresh_token);
    const confirmationToken = await this.tokenService.getConfirmationToken(user.getEmail());

    this.authRepository.updateRefreshTokenHash(user.getId(), hashedRefreshToken);
    await this.mailService.sendConfirmationEmail({
      email: 'marcelsauter9299@gmail.com',
      token: confirmationToken
    });

    return tokens;
  }

}