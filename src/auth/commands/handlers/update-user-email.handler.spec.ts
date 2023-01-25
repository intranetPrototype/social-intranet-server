import { AuthRepository } from "src/auth/db";
import { UpdateUserEmailHandler } from "./update-user-email.handler";
import { ModuleMetadata, Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { UpdateUserEmailCommand } from "../impl/update-user-email.command";
import { User } from "src/auth/model";

describe('UpdateUserEmailHandler', () => {
  let repository: AuthRepository;
  let handler: UpdateUserEmailHandler;

  beforeAll(async () => {
    const serviceProvider: Provider = {
      provide: AuthRepository,
      useValue: {}
    };
    const providers: Provider[] = [UpdateUserEmailHandler, serviceProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    repository = testModule.get(AuthRepository);
    handler = testModule.get(UpdateUserEmailHandler);
  });

  describe('exectute', () => {
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
    const updatedEmail = 'msauter-updated@test.com';

    it('should execute', async () => {
      const command = new UpdateUserEmailCommand(user.getId(), { email: updatedEmail });

      repository.updateUserEmail = jest.fn().mockResolvedValue({
        ...user,
        email: updatedEmail
      });

      await expect(handler.execute(command)).resolves.toMatchObject({
        email: updatedEmail
      });
      expect(repository.updateUserEmail).toBeCalledTimes(1);
      expect(repository.updateUserEmail).toBeCalledWith(
        user.getId(),
        updatedEmail
      );
    });
  })
});