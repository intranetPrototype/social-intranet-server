import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto, User } from "../model";
import { User as DbUser } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthRepository {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new NotFoundException(`User with the email ${email} was not found.`);
    }

    return this.mapToUser(user);
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new NotFoundException(`User was not found.`);
    }

    return this.mapToUser(user);
  }

  async confirmRegistration(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);

    await this.prismaService.user.update({
      where: {
        email,
      }, data : {
        confirmed: true
      }
    });
  }

  async updateUserEmail(userId: number, email: string): Promise<User> {
    await this.findUserById(userId);

    const user = await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        email
      }
    });

    return this.mapToUser(user);
  }

  async updateUserHash(userId: number, hash: string): Promise<User> {
    await this.findUserById(userId);

    const user = await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        hash
      }
    });

    return this.mapToUser(user);
  }

  async updateRefreshTokenHash(userId: number, refreshTokenHashed: string): Promise<User> {
    await this.findUserById(userId);

    const user = await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: refreshTokenHashed
      }
    });

    return this.mapToUser(user)
  }

  async signupUser(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...dto
        }
      });

      return this.mapToUser(user);
    } catch(error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken.');
        }

        if (error.code === 'P2009') {
          throw new InternalServerErrorException();
        }
      }

      throw error;
    }
  }

  async logoutUser(userId: number): Promise<void> {
    await this.findUserById(userId);

    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null
        }
      },
      data: {
        hashedRt: null
      }
    });
  }

  async deleteUserByEmail(email: string): Promise<void> {
    await this.findUserByEmail(email);

    await this.prismaService.user.delete({
      where: {
        email: email
      }
    });
  }

  private mapToUser(user: DbUser): User {
    return new User(user);
  }
}