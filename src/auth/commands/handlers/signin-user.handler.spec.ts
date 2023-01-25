import { Provider, ModuleMetadata, ForbiddenException } from '@nestjs/common';
import { Test } from "@nestjs/testing";
import { AuthRepository } from "src/auth/db";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { TokenService } from "src/auth/services/token.service";
import { SigninUserHandler } from "./signin-user.handler";
import { SigninUserRequest, User } from 'src/auth/model';
import { SigninUserCommand } from '../impl';
import { UserRole } from '@prisma/client';
import { Tokens } from 'src/auth/types';

describe('SigninUserHandler', () => {
  let tokenService: TokenService;
  let repository: AuthRepository;
  let handler: SigninUserHandler;
  let bcryptService: BcryptService;

  beforeAll(async () => {
    const serviceProvider: Provider[] = [
      {
        provide: TokenService,
        useValue: {}
      },
      {
        provide: AuthRepository,
        useValue: {}
      },
      {
        provide: BcryptService,
        useValue: {}
      }
    ];
    const providers: Provider[] = [SigninUserHandler, ...serviceProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    tokenService = testModule.get(TokenService);
    repository = testModule.get(AuthRepository);
    handler = testModule.get(SigninUserHandler);
    bcryptService = testModule.get(BcryptService);
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
    const signinUserRequest: SigninUserRequest = {
      email: 'msauter@test.com',
      password: '12345'
    };
    const tokens: Tokens = {
      access_token: 'access_token',
      refresh_token: 'refresh_token'
    };
    const hashedRt = 'hashed_refresh_token';
    let command: SigninUserCommand;

    beforeEach(() => {
      command = new SigninUserCommand(signinUserRequest);
    });

    it('should throw an error if email is wrong', async () => {
      repository.findUserByEmail = jest.fn().mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrowError(
        ForbiddenException
      );
      expect(repository.findUserByEmail).toBeCalledTimes(1);
      expect(repository.findUserByEmail).toBeCalledWith(
        signinUserRequest.email
        );
    });

    it('should throw an error if password is wrong', async () => {
      repository.findUserByEmail = jest.fn().mockResolvedValue(user);
      bcryptService.compare = jest.fn().mockResolvedValue(false);

      await expect(handler.execute(command)).rejects.toThrowError(
        ForbiddenException
      );
      expect(repository.findUserByEmail).toBeCalledTimes(1);
      expect(repository.findUserByEmail).toBeCalledWith(
        signinUserRequest.email
      );
      expect(bcryptService.compare).toBeCalledTimes(1);
      expect(bcryptService.compare).toBeCalledWith(
        signinUserRequest.password,
        user.getHash()
      );
    });

    it('should execute', async () => {
      repository.findUserByEmail = jest.fn().mockResolvedValue(user);
      repository.updateRefreshTokenHash = jest.fn().mockResolvedValue({
        ...user,
        hashedRt
      });
      bcryptService.compare = jest.fn().mockResolvedValue(true);
      bcryptService.hashData = jest.fn().mockResolvedValue(hashedRt);
      tokenService.getTokens = jest.fn().mockResolvedValue(tokens);

      await expect(handler.execute(command)).resolves.toEqual(
        tokens
      );
      expect(repository.findUserByEmail).toBeCalledTimes(1);
      expect(repository.findUserByEmail).toBeCalledWith(
        signinUserRequest.email
      );
      expect(bcryptService.compare).toBeCalledTimes(1);
      expect(bcryptService.compare).toBeCalledWith(
        signinUserRequest.password,
        user.getHash()
      );
      expect(tokenService.getTokens).toBeCalledTimes(1);
      expect(tokenService.getTokens).toBeCalledWith(
        user.getId(),
        user.getEmail(),
        user.getRole()
      );
      expect(bcryptService.hashData).toBeCalledTimes(1);
      expect(bcryptService.hashData).toBeCalledWith(
        tokens.refresh_token
      );
      expect(repository.updateRefreshTokenHash).toBeCalledTimes(1);
      expect(repository.updateRefreshTokenHash).toBeCalledWith(
        user.getId(),
        hashedRt
      );
    });
  });
})