export class UploadProfilePictureCommand {

  constructor(
    readonly userId: number,
    readonly profilePicture: Express.Multer.File
  ) { }

}