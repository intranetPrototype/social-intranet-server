import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserPasswordCommand } from "../impl/update-user-password.command";
import { AuthRepository } from "src/auth/db";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { User } from "src/auth/model";

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ userId, updateUserPasswordRequest }: UpdateUserPasswordCommand): Promise<User> {
    const hash = await this.bcryptService.hashData(updateUserPasswordRequest.password);

    return this.authRepository.updateUserHash(userId, hash);
  }

}