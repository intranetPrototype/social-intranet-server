import { GetUserByEmailHandler } from './handlers';
import { GetUserHandler } from './handlers';

export * from './impl';

export const AuthQueryHandlers = [
  GetUserByEmailHandler,
  GetUserHandler
];