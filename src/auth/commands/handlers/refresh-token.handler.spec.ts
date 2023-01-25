import { ForbiddenException, ModuleMetadata, Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "src/auth/db";
import { User } from "src/auth/model";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { TokenService } from "src/auth/services/token.service";
import { RefreshTokenCommand } from "../impl";
import { RefreshTokenHandler } from "./refresh-token.handler";
import { RefreshTokenRequest } from 'src/auth/model';
import { Tokens } from 'src/auth/types';

describe('RefreshTokenHandler', () => {
  let tokenService: TokenService;
  let repository: AuthRepository;
  let handler: RefreshTokenHandler;
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
    const providers: Provider[] = [RefreshTokenHandler, ...serviceProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    tokenService = testModule.get(TokenService);
    repository = testModule.get(AuthRepository);
    handler = testModule.get(RefreshTokenHandler);
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
    const userWithoutRt = new User({
      id: 1,
      hash: 'hash',
      email: 'msauter@test.com',
      role: [ UserRole.STANDARD ],
      hashedRt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      confirmed: false
    });
    const refreshTokenRequest: RefreshTokenRequest = {
      userId: user.getId(),
      refreshToken: 'refreshToken'
    };
    let command: RefreshTokenCommand;

    beforeEach(() => {
      command = new RefreshTokenCommand(refreshTokenRequest);
    });

    it('should throw error if user has no hashedRt', async () => {
      repository.findUserById = jest.fn().mockResolvedValue(userWithoutRt);

      await expect(handler.execute(command)).rejects.toThrowError(
        ForbiddenException
      );
      expect(repository.findUserById).toBeCalledTimes(1);
      expect(repository.findUserById).toBeCalledWith(refreshTokenRequest.userId);
    });

    it('should throw error if sended refreshToken and stored refreshToken not match', async () => {
      repository.findUserById = jest.fn().mockResolvedValue(user);
      bcryptService.compare = jest.fn().mockResolvedValue(false);

      await expect(handler.execute(command)).rejects.toThrowError(
        ForbiddenException
      );
      expect(repository.findUserById).toBeCalledTimes(1);
      expect(repository.findUserById).toBeCalledWith(refreshTokenRequest.userId);
      expect(bcryptService.compare).toBeCalledTimes(1);
      expect(bcryptService.compare).toBeCalledWith(
        refreshTokenRequest.refreshToken,
        user.getHashedRt()
      );
    });

    it('should execute RefreshTokenCommand', async () => {
      const tokens: Tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token'
      };
      const hashedRt = 'hashed_refresh_token';

      repository.findUserById = jest.fn().mockResolvedValue(user);
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
      expect(repository.findUserById).toBeCalledTimes(1);
      expect(repository.findUserById).toBeCalledWith(refreshTokenRequest.userId);
      expect(bcryptService.compare).toBeCalledTimes(1);
      expect(bcryptService.compare).toBeCalledWith(refreshTokenRequest.refreshToken, user.getHashedRt());
      expect(tokenService.getTokens).toBeCalledTimes(1);
      expect(tokenService.getTokens).toBeCalledWith(user.getId(), user.getEmail(), user.getRole());
      expect(bcryptService.hashData).toBeCalledTimes(1);
      expect(bcryptService.hashData).toBeCalledWith(tokens.refresh_token);
      expect(repository.updateRefreshTokenHash).toBeCalledTimes(1);
      expect(repository.updateRefreshTokenHash).toBeCalledWith(user.getId(), hashedRt);
    });
  })
});