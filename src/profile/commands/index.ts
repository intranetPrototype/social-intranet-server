import { UpdateProfileHandler, UploadCoverPhotoHandler, UploadProfilePictureHandler } from './handlers';

export * from './impl';

export const ProfileCommandHandlers = [
  UpdateProfileHandler,
  UploadCoverPhotoHandler,
  UploadProfilePictureHandler
];