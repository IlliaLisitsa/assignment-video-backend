import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  removeFileFromFS(filePath: string) {
    try {
      fs.access(filePath, (err) => {
        if (err) {
          console.error(`[ERROR] deleteFile -> fs.access: [ ${err.message} ]`);
        }
      });
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`[ERROR] deleteFile -> fs.unlink: [ ${err.message} ]`);
        }
      });
    } catch (e) {
      throw new BadRequestException('Something went wrong');
    }
  }
}
