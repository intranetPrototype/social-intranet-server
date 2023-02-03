import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmRegistrationCommand } from "../impl";
import { AuthRepository } from "src/auth/db";
import { User } from "../../model";

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler implements ICommandHandler<ConfirmRegistrationCommand> {

  constructor(private readonly authRepository: AuthRepository) { }

  execute({ email }: ConfirmRegistrationCommand): Promise<User> {
    return this.authRepository.confirmRegistration(email);
  }

}