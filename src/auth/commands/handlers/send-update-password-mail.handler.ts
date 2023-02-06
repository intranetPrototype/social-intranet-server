import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendUpdatePasswordMailCommand } from "../impl";
import { AuthRepository } from "../../db";
import { TokenService } from "../../services/token.service";
import { MailService } from "../../services/mail.service";

@CommandHandler(SendUpdatePasswordMailCommand)
export class SendUpdatePasswordMailHandler implements ICommandHandler<SendUpdatePasswordMailCommand> {

  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ email }: SendUpdatePasswordMailCommand): Promise<void> {
    await this.authRepository.findUserByEmail(email);

    const passwordConfirmationToken = await this.tokenService.getConfirmationToken(email);
    await this.mailService.sendResetPasswordEmail({
      email: 'marcelsauter9299@gmail.com',
      token: passwordConfirmationToken
    });
  }

}