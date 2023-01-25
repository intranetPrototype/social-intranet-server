import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "@prisma/client";
import { AuthRepository } from "src/auth/db";
import { LogoutUserCommand } from "../impl";

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {

  constructor(
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ logoutUserRequest }: LogoutUserCommand): Promise<void> {
    const { userId } = logoutUserRequest

    return this.authRepository.logoutUser(userId);
  }

}