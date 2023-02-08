import {
  ConfirmRegistrationHandler,
  DeleteUserHandler,
  LogoutUserHandler,
  RefreshTokenHandler,
  ResendConfirmRegistrationHandler,
  SendUpdatePasswordMailHandler,
  SigninUserHandler,
  SignupUserHandler,
  UpdateUserEmailHandler,
  UpdateUserPasswordHandler
} from "./handlers";

export * from './impl';

export const AuthCommandHandlers = [
  ConfirmRegistrationHandler,
  DeleteUserHandler,
  LogoutUserHandler,
  RefreshTokenHandler,
  ResendConfirmRegistrationHandler,
  SendUpdatePasswordMailHandler,
  SigninUserHandler,
  SignupUserHandler,
  UpdateUserEmailHandler,
  UpdateUserPasswordHandler
];