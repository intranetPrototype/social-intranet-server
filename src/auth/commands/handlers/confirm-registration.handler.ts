import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmRegistrationCommand } from "../impl";
import { AuthRepository } from "src/auth/db";

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler implements ICommandHandler<ConfirmRegistrationCommand> {

  constructor(private readonly authRepository: AuthRepository) { }

  async execute({ email }: ConfirmRegistrationCommand): Promise<void> {
    this.authRepository.confirmRegistration(email);
  }

}