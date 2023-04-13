import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCurrentUserId, Public } from 'src/common';
import { GetFileQuery } from './queries';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Blob } from 'buffer';

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

}
