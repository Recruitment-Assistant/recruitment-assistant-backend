import { ErrorCode } from '@common/constants/error-code';
import { ValidationException } from '@common/exceptions/validation.exception';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class MulterHandler {
  constructor(
    private readonly extensions: string[],
    private readonly destinationPath: string,
    private readonly maxFileSize: number = 10 * 1024 * 1024,
  ) {
    this.validateParams();
  }

  private validateParams() {
    if (
      typeof this.extensions !== 'object' ||
      !Array.isArray(this.extensions)
    ) {
      throw new Error(
        'extensions must be an array and contain at least one element!',
      );
    }

    fs.access(this.destinationPath, (error) => {
      if (error) {
        fs.mkdirSync(this.destinationPath);
      }
    });
  }

  configurations() {
    return {
      storage: diskStorage({
        destination: this.destinationPath,
        filename: (_req, file, cb) => {
          const fileName = `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !this.extensions.includes(
            extname(file.originalname).toLocaleLowerCase(),
          )
        ) {
          cb(
            new ValidationException(ErrorCode.COMMON, 'Only support pdf file'),
            false,
          );
        }

        cb(null, true);
      },
      limits: {
        fileSize: this.maxFileSize,
      },
    };
  }
}
