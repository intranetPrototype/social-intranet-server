import { ModuleMetadata, Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "src/auth/db";
import { User } from "src/auth/model";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { TokenService } from "src/auth/services/token.service";
import { Tokens } from "src/auth/types";
import { SignupUserCommand } from "../impl";
import { SignupUserHandler } from "./signup-user.handler";
import { SignupUserRequest } from 'src/auth/model';
import { MailService } from "src/auth/services/mail.service";

describe('SignupUserHandler', () => {
  let mailService: MailService;
  let tokenService: TokenService;
  let repository: AuthRepository;
  let handler: SignupUserHandler;
  let bcryptService: BcryptService;

  beforeAll(async () => {
    const serviceProvider: Provider[] = [
      {
        provide: MailService,
        useValue: {}
      },
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
    const providers: Provider[] = [SignupUserHandler, ...serviceProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    mailService = testModule.get(MailService);
    tokenService = testModule.get(TokenService);
    repository = testModule.get(AuthRepository);
    handler = testModule.get(SignupUserHandler);
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
    const signupUserRequest: SignupUserRequest = {
      email: user.getEmail(),
      password: '12345'
    };
    const tokens: Tokens = {
      access_token: 'access_token',
      refresh_token: 'refresh_token'
    };
    const hashedRt = 'hashed_refresh_token';
    const confirmationToken = 'confirmation_token';

    it('should execute', async () => {
      bcryptService.hashData = jest.fn()
        .mockReturnValueOnce(user.getHash())
        .mockReturnValueOnce(hashedRt);
      repository.signupUser = jest.fn().mockResolvedValue(user);
      repository.updateRefreshTokenHash = jest.fn().mockResolvedValue({
        ...user,
        hashedRt
      });
      tokenService.getTokens = jest.fn().mockResolvedValue(tokens);
      tokenService.getConfirmationToken = jest.fn().mockResolvedValue(confirmationToken);
      mailService.sendConfirmationEmail = jest.fn().mockResolvedValue(undefined);

      const command = new SignupUserCommand(signupUserRequest);

      await expect(handler.execute(command)).resolves.toBe(
        tokens
      );
      expect(bcryptService.hashData).toBeCalledTimes(2);
      expect(bcryptService.hashData).toBeCalledWith(
        signupUserRequest.password
      );
      expect(bcryptService.hashData).toBeCalledWith(
        tokens.refresh_token
      );
      expect(repository.signupUser).toBeCalledTimes(1);
      expect(repository.signupUser).toBeCalledWith({
        email: user.getEmail(),
        hash: user.getHash(),
        hashedRt: null,
        role: [UserRole.STANDARD]
    });
      expect(tokenService.getTokens).toBeCalledTimes(1);
      expect(tokenService.getTokens).toBeCalledWith(
        user.getId(),
        user.getEmail(),
        user.getRole()
      );
      expect(repository.updateRefreshTokenHash).toBeCalledTimes(1);
      expect(repository.updateRefreshTokenHash).toBeCalledWith(
        user.getId(),
        hashedRt
      );
      expect(mailService.sendConfirmationEmail).toBeCalledTimes(1);
      expect(mailService.sendConfirmationEmail).toBeCalledWith({
        email: 'marcelsauter9299@gmail.com',                          // .env file --> sender mail
        token: confirmationToken
      });
    });
  });
});
