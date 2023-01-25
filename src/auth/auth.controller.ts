import { Controller, Post, Body, HttpStatus, Delete, Param, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { Get, HttpCode, Put, UseGuards } from '@nestjs/common/decorators';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetCurrentUser, GetCurrentUserId, Public, RefreshTokenGuard } from '../common';
import { ConfirmRegistrationCommand, DeleteUserCommand, LogoutUserCommand, RefreshTokenCommand, SigninUserCommand, SignupUserCommand } from './commands';
import { SigninUserRequest, SignupUserRequest, UpdateUserEmailRequest, UpdateUserPasswordRequest, User } from './model';
import { Tokens } from './types';
import { GetUserByEmailQuery } from './queries/impl';
import { UpdateUserEmailCommand } from './commands/impl/update-user-email.command';
import { UpdateUserPasswordCommand } from './commands/impl/update-user-password.command';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { ConfirmEmailTokenGuard } from './guards';

@Controller()
export class AuthController {

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:email')
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.queryBus.execute<GetUserByEmailQuery, User>(
      new GetUserByEmailQuery(email)
    );
  }

  @Public()
  @Post('signup')
  signup(@Body() signupUserRequest: SignupUserRequest): Promise<Tokens> {
    return this.commandBus.execute<SignupUserCommand, Tokens>(
      new SignupUserCommand(signupUserRequest)
    );
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinUserRequest: SigninUserRequest): Promise<Tokens> {
    return this.commandBus.execute<SigninUserCommand, Tokens>(
      new SigninUserCommand(signinUserRequest)
    );
  }

  @Public()
  @UseGuards(ConfirmEmailTokenGuard)
  @Post('confirm-registration')
  @HttpCode(HttpStatus.OK)
  confirmRegistration(@GetCurrentUser('email') confirmationMail: string): Promise<void> {
    return this.commandBus.execute<ConfirmRegistrationCommand, void>(
      new ConfirmRegistrationCommand(confirmationMail)
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<void> {
    return this.commandBus.execute<LogoutUserCommand, void>(
      new LogoutUserCommand({ userId })
    );
  }

  @Put('user/email')
  @HttpCode(HttpStatus.OK)
  updateEmail(
    @GetCurrentUserId() userId: number,
    @Body() updateUserEmailRequest: UpdateUserEmailRequest
  ): Promise<User> {
    return this.commandBus.execute<UpdateUserEmailCommand, User>(
      new UpdateUserEmailCommand(
        userId,
        updateUserEmailRequest
      )
    );
  }

  @Put('user/password')
  @HttpCode(HttpStatus.OK)
  updatePassword(
    @GetCurrentUserId() userId: number,
    @Body() updateUserPassowrdRequest: UpdateUserPasswordRequest
  ) {
    return this.commandBus.execute<UpdateUserPasswordCommand, User>(
      new UpdateUserPasswordCommand(
        userId,
        updateUserPassowrdRequest
      )
    );
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): any {
    return this.commandBus.execute<RefreshTokenCommand, Tokens>(
      new RefreshTokenCommand({ userId, refreshToken })
    );
  }

  @Roles('ADMIN')
  @Delete('delete/:email')
  deleteUser(@Param('email') email: string): Promise<void> {
    return this.commandBus.execute<DeleteUserCommand, void>(
      new DeleteUserCommand(email)
    );
  }
}
