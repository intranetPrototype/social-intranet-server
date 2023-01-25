import { ModuleMetadata, Provider } from "@nestjs/common";
import { AuthRepository } from "src/auth/db";
import { GetUserByEmailQuery } from "../impl";
import { GetUserByEmailHandler } from "./get-user-by-email.handler";
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { User } from "src/auth/model";

describe('GetUserByEmailHandler', () => {
  let authRepository: AuthRepository;
  let handler: GetUserByEmailHandler;

  beforeAll(async () => {
    const serviceProvider: Provider = {
      provide: AuthRepository,
      useValue: {}
    };
    const providers = [ GetUserByEmailHandler, serviceProvider ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    authRepository = testModule.get(AuthRepository);
    handler = testModule.get(GetUserByEmailHandler);
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

    it('should execture GetUserByEmailQuery', async () => {
      const command = new GetUserByEmailQuery(user.getEmail())
      authRepository.findUserByEmail = jest.fn().mockResolvedValue(user);

      await expect(handler.execute(command)).resolves.toEqual(user);
      expect(authRepository.findUserByEmail).toBeCalledTimes(1);
      expect(authRepository.findUserByEmail).toBeCalledWith(user.getEmail())
    });
  });
});