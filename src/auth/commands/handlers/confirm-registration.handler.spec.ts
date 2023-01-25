import { AuthRepository } from "src/auth/db";
import { ConfirmRegistrationHandler } from "./confirm-registration.handler";
import { ModuleMetadata, Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "src/auth/model";
import { UserRole } from "@prisma/client";
import { ConfirmRegistrationCommand } from "../impl";
import { response } from "express";

describe('ConfirmRegistrationHandler', () => {
  let repository: AuthRepository;
  let handler: ConfirmRegistrationHandler;

  beforeAll(async () => {
    const serviceProvider: Provider = {
      provide: AuthRepository,
      useValue: {}
    };
    const providers: Provider[] = [ConfirmRegistrationHandler, serviceProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    repository = testModule.get(AuthRepository);
    handler = testModule.get(ConfirmRegistrationHandler);
  });

  describe('execute', () => {
    const user = new User({
      id: 1,
      hash: 'hash',
      email: 'msauter@test.com',
      role: [ UserRole.STANDARD ],
      hashedRt: 'hashedRt',
      createdAt: new Date(),
      updatedAt: new Date(),
      confirmed: false
    });

    it('should execute', async () => {
      const command = new ConfirmRegistrationCommand(user.getEmail());

      repository.confirmRegistration = jest.fn().mockResolvedValue(undefined);

      await expect(handler.execute(command)).resolves.toBeUndefined();
      expect(repository.confirmRegistration).toBeCalledTimes(1);
      expect(repository.confirmRegistration).toBeCalledWith(user.getEmail());
    });
  });
});