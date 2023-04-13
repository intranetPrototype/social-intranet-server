import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './db/profile.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileQueryHandlers } from './queries';
import { ProfileCommandHandlers } from './commands';
import { FileServerService } from 'src/file-server/services/file-server.service';

@Module({
  imports: [
    CqrsModule
  ],
  controllers: [
    ProfileController
  ],
  providers: [
    ProfileRepository,
    FileServerService,

    ...ProfileQueryHandlers,
    ...ProfileCommandHandlers,
  ]
})
export class ProfileModule { }
