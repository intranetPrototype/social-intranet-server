import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthRepository } from "src/auth/db";
import { DeleteUserCommand } from "../impl";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {

  constructor(
    private readonly authRepository: AuthRepository
  ) { }

  async execute({ email }: DeleteUserCommand): Promise<any> {
    this.authRepository.deleteUserByEmail(email);
  }

}