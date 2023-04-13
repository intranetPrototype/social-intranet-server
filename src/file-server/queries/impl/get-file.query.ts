export class GetFileQuery {

  constructor(
    readonly userId: number,
    readonly fileName: string
  ) { }

}