import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile as DbProfile, User } from '@prisma/client';
import { Profile, UpdateProfileRequest } from '../model';

@Injectable()
export class ProfileRepository {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async uploadCoverPhoto(userId: number, coverPhotoPath: string): Promise<Profile> {
    const profile = await this.prismaService.profile.update({
      where: {
        userId
      },
      data: {
        coverPhoto: coverPhotoPath
      }
    });

    return this.mapToProfile(profile, null);
  }

  async uploadProfilePicture(userId: number, profilePicturePath: string): Promise<Profile> {
    const profile = await this.prismaService.profile.update({
      where: {
        userId
      },
      data: {
        profilePicture: profilePicturePath
      }
    });

    return this.mapToProfile(profile, null);
  }

  async updateProfile(userId: number, updateProfileRequest: UpdateProfileRequest): Promise<Profile> {
    const profile = await this.prismaService.profile.update({
      where: {
        userId
      },
      data: {
        ...updateProfileRequest.profile,
        user: {
          update: {
            lastName: updateProfileRequest.user.lastName,
            firstName: updateProfileRequest.user.firstName
          }
        }
      },
      include: {
        user: true
      }
    });

    return this.mapToProfile(profile, profile.user);
  }

  async getProfile(userId: number): Promise<Profile> {
    return this.findProfileByUserId(userId);
  }

  private async findProfileByUserId(userId: number): Promise<Profile> {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        userId
      },
      include: {
        user: true
      }
    });

    return this.mapToProfile(profile, profile.user);
  }

  private mapToProfile(profile: DbProfile, user: User): Profile {
    return new Profile(profile, user);
  }
}
