import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetFileQuery } from "../impl";
import { FileServerService } from "src/file-server/services/file-server.service";
import { StreamableFile } from "@nestjs/common";

@QueryHandler(GetFileQuery)
export class GetFileHandler implements IQueryHandler<GetFileQuery> {

  constructor(
    private readonly fileServerService: FileServerService
  ) { }

  execute({ userId, fileName }: GetFileQuery): Promise<StreamableFile> {
    return this.fileServerService.getFileFromFileServer(userId, fileName);
  }

}