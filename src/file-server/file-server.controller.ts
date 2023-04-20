import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, StreamableFile } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCurrentUserId, Public } from 'src/common';
import { GetFileQuery, GetProfilePicturesQuery } from './queries';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetProfilePicturesRequest, GetProfilePicturesResponse } from './model';

@Controller('file-server')
@ApiTags('FileServer')
export class FileServerController {

  constructor(
    private readonly queryBus: QueryBus
  ) { }

  @ApiOkResponse({
    description: 'Get file from file-server',
    schema: {
      type: 'string',
      format: 'binary'
    }
  })
  @Get(':fileName')
  @Header('Content-Type', 'image/jpeg')
  getFileFromFileServer(
    @GetCurrentUserId() userId: number,
    @Param('fileName') fileName: string
  ): Promise<StreamableFile> {
    return this.queryBus.execute<GetFileQuery, StreamableFile>(
      new GetFileQuery(userId, fileName)
    );
  }

  @ApiOkResponse({
    description: 'Get profile pictures of search profiles',
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number'
        },
        profilePicture: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @Post('profile-pictures')
  @HttpCode(HttpStatus.OK)
  getProfilePictures(@Body() getProfilePicturesRequest: GetProfilePicturesRequest): Promise<GetProfilePicturesResponse> {
    return this.queryBus.execute<GetProfilePicturesQuery, GetProfilePicturesResponse>(
      new GetProfilePicturesQuery(getProfilePicturesRequest.profilePictureUserIds)
    );
  }

}
