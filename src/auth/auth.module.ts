import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthCommandHandlers } from './commands';
import { AuthRepository } from './db';
import { AuthServices } from './services';
import { AuthStrategies } from './strategies';
import { AuthQueryHandlers } from './queries';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfirmEmailTokenGuard } from './guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: 'MAIL_SERVER',
        transport: Transport.TCP
      }
    ])
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthRepository,

    ...AuthServices,
    ...AuthStrategies,
    ...AuthQueryHandlers,
    ...AuthCommandHandlers
  ]
})
export class AuthModule { }
