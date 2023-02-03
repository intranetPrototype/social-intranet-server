import { Controller, Post, Body, HttpStatus, Delete, Param, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { Get, HttpCode, Put, UseGuards } from '@nestjs/common/decorators';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetCurrentUser, GetCurrentUserId, Public, RefreshTokenGuard } from '../common';
import { ConfirmRegistrationCommand, DeleteUserCommand, LogoutUserCommand, RefreshTokenCommand, SigninUserCommand, SignupUserCommand } from './commands';
import { SigninUserRequest, SignupUserRequest, UpdateUserEmailRequest, UpdateUserPasswordRequest, User } from './model';
import { Tokens } from './types';
import { GetUserByEmailQuery, GetUserQuery } from './queries/impl';
import { UpdateUserEmailCommand } from './commands/impl/update-user-email.command';
import { UpdateUserPasswordCommand } from './commands/impl/update-user-password.command';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { ConfirmEmailTokenGuard } from './guards';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Auth')
export class AuthController {

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:email')
  @ApiOkResponse({
    description: 'Get user by email response',
    type: User
  })
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.queryBus.execute<GetUserByEmailQuery, User>(
      new GetUserByEmailQuery(email)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  @ApiOkResponse({
    description: 'Get user by token',
    type: User
  })
  getUser(@GetCurrentUserId() userId: number): Promise<User> {
    return this.queryBus.execute<GetUserQuery, User>(
      new GetUserQuery(userId)
    );
  }

  @Public()
  @Post('signup')
  @ApiOkResponse({
    description: 'Signup user response',
    type: Tokens
  })
  signup(@Body() signupUserRequest: SignupUserRequest): Promise<Tokens> {
    return this.commandBus.execute<SignupUserCommand, Tokens>(
      new SignupUserCommand(signupUserRequest)
    );
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Signin user response',
    type: Tokens,
    status: 200
  })
  signin(@Body() signinUserRequest: SigninUserRequest): Promise<Tokens> {
    return this.commandBus.execute<SigninUserCommand, Tokens>(
      new SigninUserCommand(signinUserRequest)
    );
  }

  @Public()
  @UseGuards(ConfirmEmailTokenGuard)
  @Post('confirm-registration')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Confirm user registration',
    type: User,
    status: 200
  })
  confirmRegistration(@GetCurrentUser('email') confirmationMail: string): Promise<User> {
    return this.commandBus.execute<ConfirmRegistrationCommand, User>(
      new ConfirmRegistrationCommand(confirmationMail)
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Logout user response',
    status: 200
  })
  logout(@GetCurrentUserId() userId: number): Promise<void> {
    return this.commandBus.execute<LogoutUserCommand, void>(
      new LogoutUserCommand({ userId })
    );
  }

  @Put('user/email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Update user email response',
    type: User,
    status: 200
  })
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
  @ApiOkResponse({
    description: 'Update user password response',
    type: User,
    status: 200
  })
  updatePassword(
    @GetCurrentUserId() userId: number,
    @Body() updateUserPassowrdRequest: UpdateUserPasswordRequest
  ): Promise<User> {
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
  @ApiOkResponse({
    description: 'Refresh user tokens response',
    type: Tokens,
    status: 200
  })
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
  @ApiOkResponse({
    description: 'Delete user response (only for admin)',
  })
  deleteUser(@Param('email') email: string): Promise<void> {
    return this.commandBus.execute<DeleteUserCommand, void>(
      new DeleteUserCommand(email)
    );
  }
}
