import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, mkdir, mkdirSync, writeFile, writeFileSync } from 'fs';

@Injectable()
export class FileServerService {

  getFileFromFileServer(userId: number, fileName: string): Promise<StreamableFile> {
    return new Promise<StreamableFile>((res, rej) => {
      const file = createReadStream(`file-server/${userId}/${fileName}`);

      return res(new StreamableFile(file));
    });
  }

  saveFile(userId: number, fileName: string, file: Express.Multer.File): string {
    const dirPath = `file-server/${userId}`;
    const filePath = `${dirPath}/${fileName}.jpg`;

    mkdirSync(dirPath, { recursive: true });
    writeFileSync(filePath, file.buffer);

    return `file-server/${fileName}.jpg`;
  }

}
