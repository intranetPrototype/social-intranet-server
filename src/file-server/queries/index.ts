import { GetFileHandler, GetProfilePicturesHandler } from './handlers';

export * from './impl';

export const FileServerHandlers = [
  GetFileHandler,
  GetProfilePicturesHandler
];