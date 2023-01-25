import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRepository } from "./auth.repository";
import { CreateUserDto, User } from "../model";
import { UserRole } from "@prisma/client";
import { use } from "passport";
import { ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common/exceptions";
import { ValidationError } from "class-validator";

describe('AuthRepository Int', () => {
  let prismaService: PrismaService;
  let authRepository: AuthRepository;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    authRepository = moduleRef.get(AuthRepository);

    await prismaService.cleanDatabase();
  });

  describe('signupUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'msauter@test.com',
      hash: 'hashed-password',
      hashedRt: 'hashed-rt',
      role: [ UserRole.STANDARD ]
    };

    it('should signup new user', async () => {
      user = await authRepository.signupUser(createUserDto);

      expect(user.getId()).not.toBeNull();
      expect(user.getUpdatedAt()).not.toBeNull();
      expect(user.getCreatedAt()).not.toBeNull();
      expect(user.getConfirmed()).toBeFalsy();

      expect(user.getEmail()).toBe(createUserDto.email);
      expect(user.getHash()).toBe(createUserDto.hash);
      expect(user.getHashedRt()).toBe(createUserDto.hashedRt);
      expect(user.getRole()).toEqual(createUserDto.role);
    });

    it('should throw an error if user with same email tries to signup', async () => {
      await expect(authRepository.signupUser(createUserDto))
        .rejects.toEqual(new ForbiddenException('Credentials already taken.'));
    });
  });

  describe('findUserByEmail', () => {
    it('should throw error if user not found by email', async () => {
      await expect(authRepository.findUserByEmail(user.getEmail() + 'error'))
        .rejects.toStrictEqual(new NotFoundException(`User with the email ${user.getEmail() + 'error'} was not found.`));
    });

    it('should find user by email', async () => {
      await expect(authRepository.findUserByEmail(user.getEmail())).resolves.toStrictEqual(user);
    });
  });

  describe('findUserById', () => {
    it('should throw error if user not found by id', async () => {
      await expect(authRepository.findUserById(user.getId() + 1))
        .rejects.toStrictEqual(new NotFoundException('User was not found.'));
    });

    it('should find user by id', async () => {
      await expect(authRepository.findUserById(user.getId())).resolves.toStrictEqual(user);
    });
  });

  describe('updateUserEmail', () => {
    const email = 'msauter-updated@test.com';

    it('should throw an error if user not found', async () => {
      await expect(authRepository.updateUserEmail(user.getId() + 1, email))
        .rejects.toStrictEqual(new NotFoundException('User was not found.'));
    });

    it('should update user email', async () => {
      const updatedUser = await authRepository.updateUserEmail(user.getId(), email);

      expect(updatedUser.getEmail()).toBe(email);
      expect(updatedUser.getUpdatedAt().getTime()).toBeGreaterThan(user.getUpdatedAt().getTime());

      user = updatedUser;
    });
  });

  describe('updateUserHash', () => {
    const hash = 'updated-hash-password';

    it('should throw an error if user not found', async () => {
      await expect(authRepository.updateUserHash(user.getId() + 1, hash))
        .rejects.toStrictEqual(new NotFoundException('User was not found.'));
    });

    it('should update user email', async () => {
      const updatedUser = await authRepository.updateUserHash(user.getId(), hash);

      expect(updatedUser.getHash()).toBe(hash);
      expect(updatedUser.getUpdatedAt().getTime()).toBeGreaterThan(user.getUpdatedAt().getTime());
    });
  });

  describe('updateRefreshToken', () => {
    const refreshToken = 'updated-refresh-token';

    it('should throw an error if user not found', async () => {
      await expect(authRepository.updateRefreshTokenHash(user.getId() + 1, refreshToken))
        .rejects.toStrictEqual(new NotFoundException('User was not found.'))
    });

    it('should update hashedRefreshToken', async () => {
      const updatedUser = await authRepository.updateRefreshTokenHash(user.getId(), refreshToken);

      expect(updatedUser.getHashedRt()).toBe(refreshToken);
      expect(updatedUser.getUpdatedAt().getTime()).toBeGreaterThan(user.getUpdatedAt().getTime());
    });
  });

  describe('logoutUser', () => {
    it('should throw an error if user not found', async () => {
      await expect(authRepository.logoutUser(user.getId() + 1))
        .rejects.toStrictEqual(new NotFoundException('User was not found.'))
    });

    it('should logout user', async () => {
      await authRepository.logoutUser(user.getId());

      const updatedUser = await authRepository.findUserById(user.getId());

      expect(updatedUser.getHashedRt()).toBeNull;
      expect(updatedUser.getUpdatedAt().getTime()).toBeGreaterThan(user.getUpdatedAt().getTime());
    });
  });

  describe('deleteUserById', () => {
    it('should throw an error if user not found', async () => {
      await expect(authRepository.deleteUserByEmail(user.getEmail() + 'not-found'))
        .rejects.toStrictEqual(new NotFoundException(`User with the email ${user.getEmail() + 'not-found'} was not found.`));
    });

    it('should delete user', async () => {
      await authRepository.deleteUserByEmail(user.getEmail());

      await expect(authRepository.findUserById(user.getId()))
        .rejects.toStrictEqual(new NotFoundException('User was not found.'));
    })
  })
});