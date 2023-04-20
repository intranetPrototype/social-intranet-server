import { GetProfileHandler, SearchProfileByFullNameHandler } from './handlers';

export * from './impl';

export const ProfileQueryHandlers = [
  GetProfileHandler,
  SearchProfileByFullNameHandler
];