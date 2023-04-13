import { Module } from '@nestjs/common';
import { FileServerController } from './file-server.controller';
import { FileServerServices } from './services';
import { FileServerHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule
  ],
  controllers: [
    FileServerController
  ],
  providers: [
    ...FileServerHandlers,
    ...FileServerServices
  ]
})
export class FileServerModule { }
