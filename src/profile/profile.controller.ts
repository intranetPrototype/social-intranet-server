import { Body, ClassSerializerInterceptor, Controller, FileTypeValidator, Get, Header, MaxFileSizeValidator, ParseFilePipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Profile } from './model';
import { GetCurrentUserId } from 'src/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProfileQuery, SearchProfileByFullNameQuery } from './queries';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileCommand, UploadCoverPhotoCommand, UploadProfilePictureCommand } from './commands/impl';
import { UpdateProfileRequest } from './model/';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponse({
    description: 'Get user profile',
    type: Profile
  })
  getUserProfile(@GetCurrentUserId() userId: number): Promise<Profile> {
    return this.queryBus.execute<GetProfileQuery, Profile>(
      new GetProfileQuery(userId)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search')
  @ApiOkResponse({
    description: 'Profiles searched by fullName',
    type: Array<Profile>
  })
  searchUserProfile(@Query('searchString') searchString: string): Promise<Profile[]> {
    return this.queryBus.execute<SearchProfileByFullNameQuery, Profile[]>(
      new SearchProfileByFullNameQuery(searchString)
    )
  }

  @Post('upload/cover-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'Upload profile cover-photo',
    type: Profile
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'multipart/form-data',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    }
  })
  uploadCoverPhoto(
    @GetCurrentUserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 }),
          new FileTypeValidator({ fileType: 'image' })
        ]
      })
    ) coverPhoto: Express.Multer.File
  ): Promise<Profile> {
    return this.commandBus.execute<UploadCoverPhotoCommand, Profile>(
      new UploadCoverPhotoCommand(userId, coverPhoto)
    );
  }

  @Post('upload/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'Upload profile profile-picture',
    type: Profile
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'multipart/form-data',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    }
  })
  uploadProfilePicture(
    @GetCurrentUserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 }),
          new FileTypeValidator({ fileType: 'image' })
        ]
      })
    ) profilePicture: Express.Multer.File
  ): Promise<Profile> {
    return this.commandBus.execute<UploadProfilePictureCommand, Profile>(
      new UploadProfilePictureCommand(userId, profilePicture)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  @ApiOkResponse({
    description: 'Update profile',
    type: Profile
  })
  updateProfile(
    @GetCurrentUserId() userId: number,
    @Body() updateProfileRequest: UpdateProfileRequest
  ): Promise<Profile> {
    return this.commandBus.execute<UpdateProfileCommand, Profile>(
      new UpdateProfileCommand(userId, updateProfileRequest)
    );
  }

}
