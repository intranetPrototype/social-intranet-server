import { NotFoundException, ModuleMetadata, Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthRepository } from "src/auth/db";
import { DeleteUserCommand } from "../impl";
import { DeleteUserHandler } from "./delete-user.handler"

describe('DeleteUserHanlder', () => {
  let handler: DeleteUserHandler;
  let repository: AuthRepository;

  beforeAll(async () => {
    const repoProvider: Provider = {
      provide: AuthRepository,
      useValue: {}
    };
    const providers: Provider[] = [DeleteUserHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(DeleteUserHandler);
    repository = testModule.get(AuthRepository);
  });

  describe('execute', () => {
    const email = 'msauter@test.com';
    let command: DeleteUserCommand;

    beforeEach(() => {
      command = new DeleteUserCommand(email)
    })

    it('should execute', async () => {
      repository.deleteUserByEmail = jest.fn().mockResolvedValue(undefined);

      await expect(handler.execute(command)).resolves.toBeUndefined();
      expect(repository.deleteUserByEmail).toBeCalledTimes(1);
      expect(repository.deleteUserByEmail).toBeCalledWith(email);
    });
  })
})