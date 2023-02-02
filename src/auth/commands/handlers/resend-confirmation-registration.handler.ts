import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResendConfirmRegistrationCommand } from "../impl";
import { AuthRepository } from "src/auth/db";
import { ForbiddenException } from "@nestjs/common";
import { MailService } from "src/auth/services/mail.service";
import { TokenService } from "src/auth/services/token.service";

@CommandHandler(ResendConfirmRegistrationCommand)
export class ResendConfirmRegistrationHandler implements ICommandHandler<ResendConfirmRegistrationCommand> {

  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ email }: ResendConfirmRegistrationCommand): Promise<void> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user || user.getConfirmed()) {
      throw new ForbiddenException('Access Denied');
    }

    const confirmationToken = await this.tokenService.getConfirmationToken(email);

    this.mailService.sendConfirmationEmail({
      email,
      token: confirmationToken
    });
  }

}