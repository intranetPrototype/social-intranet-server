import { ConfirmRegistrationHandler, DeleteUserHandler, LogoutUserHandler, RefreshTokenHandler, SigninUserHandler, SignupUserHandler, UpdateUserEmailHandler, UpdateUserPasswordHandler } from "./handlers";

export * from './impl';

export const AuthCommandHandlers = [
  ConfirmRegistrationHandler,
  DeleteUserHandler,
  LogoutUserHandler,
  RefreshTokenHandler,
  SigninUserHandler,
  SignupUserHandler,
  UpdateUserEmailHandler,
  UpdateUserPasswordHandler
];