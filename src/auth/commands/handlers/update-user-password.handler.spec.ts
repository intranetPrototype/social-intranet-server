import { AuthRepository } from "src/auth/db";
import { UpdateUserPasswordHandler } from "./update-user-password.handler";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { ModuleMetadata, Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { User } from "src/auth/model";
import { UpdateUserPasswordCommand } from "../impl/update-user-password.command";

describe('UpdateUserPasswordHandler', () => {
  let repository: AuthRepository;
  let bcryptService: BcryptService;
  let handler: UpdateUserPasswordHandler;

  beforeAll(async () => {
    const serviceProviders: Provider[] = [
      {
        provide: AuthRepository,
        useValue: {}
      },
      {
        provide: BcryptService,
        useValue: {}
      }
    ];
    const providers: Provider[] = [UpdateUserPasswordHandler, ...serviceProviders];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    repository = testModule.get(AuthRepository);
    bcryptService = testModule.get(BcryptService);
    handler = testModule.get(UpdateUserPasswordHandler);
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
    const updatedPassword = 'updated-password';
    const updatedPasswordHash = 'updated-password-hash';

    it('should execute', async () => {
      const command = new UpdateUserPasswordCommand(user.getId(), { password: updatedPassword });

      bcryptService.hashData = jest.fn().mockResolvedValue(updatedPasswordHash);
      repository.updateUserHash = jest.fn().mockResolvedValue({
        ...user,
        hash: updatedPasswordHash
      });

      await expect(handler.execute(command)).resolves.toMatchObject({
        hash: updatedPasswordHash
      });
      expect(bcryptService.hashData).toBeCalledTimes(1);
      expect(bcryptService.hashData).toBeCalledWith(updatedPassword);
      expect(repository.updateUserHash).toBeCalledTimes(1);
      expect(repository.updateUserHash).toBeCalledWith(
        user.getId(),
        updatedPasswordHash
      );
    });
  });
});