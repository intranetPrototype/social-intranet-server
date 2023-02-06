import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserPasswordCommand } from "../impl/update-user-password.command";
import { AuthRepository } from "src/auth/db";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { User } from "src/auth/model";
import { MailService } from "../../services/mail.service";
import { TokenService } from "../../services/token.service";

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {

  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ email, updateUserPasswordRequest }: UpdateUserPasswordCommand): Promise<User> {
    const hash = await this.bcryptService.hashData(updateUserPasswordRequest.password);

    return this.authRepository.updateUserHash(email, hash);
  }

}