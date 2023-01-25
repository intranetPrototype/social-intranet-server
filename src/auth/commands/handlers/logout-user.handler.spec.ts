import { ModuleMetadata, Provider, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "src/auth/db";
import { User } from "src/auth/model";
import { LogoutUserCommand } from "../impl";
import { LogoutUserHandler } from "./logout-user.handler";

describe('LogoutUserHandler', () => {
  let handler: LogoutUserHandler;
  let repository: AuthRepository;

  beforeAll(async () => {
    const repoProvider: Provider = {
      provide: AuthRepository,
      useValue: {}
    };
    const providers: Provider[] = [LogoutUserHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(LogoutUserHandler);
    repository = testModule.get(AuthRepository);
  });

  describe('exectute', () => {
    it('should throw error if user not found', async () => {
      repository.logoutUser = jest.fn().mockRejectedValue(new NotFoundException());

      const command = new LogoutUserCommand({ userId: 1 });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException
      );
      expect(repository.logoutUser).toBeCalledTimes(1);
      expect(repository.logoutUser).toBeCalledWith(command.logoutUserRequest.userId);
    });

    it('should execute LogoutUserCommand', async () => {
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

      repository.logoutUser = jest.fn().mockResolvedValue(user);

      const command = new LogoutUserCommand({ userId: user.getId() });

      await expect(handler.execute(command)).resolves.toEqual(user);
      expect(repository.logoutUser).toBeCalledTimes(1);
      expect(repository.logoutUser).toBeCalledWith(command.logoutUserRequest.userId);
    });
  })
});