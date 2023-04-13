export class UploadCoverPhotoCommand {

  constructor(
    readonly userId: number,
    readonly coverPhoto: Express.Multer.File
  ) { }

}