import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserEmailCommand } from "../impl/update-user-email.command";
import { AuthRepository } from "src/auth/db";
import { User } from "src/auth/model";

@CommandHandler(UpdateUserEmailCommand)
export class UpdateUserEmailHandler implements ICommandHandler<UpdateUserEmailCommand> {

  constructor(private readonly authRepository: AuthRepository) { }

  execute({ userId, updateUserEmailRequest }: UpdateUserEmailCommand): Promise<User> {
    return this.authRepository.updateUserEmail(userId, updateUserEmailRequest.email);
  }

}