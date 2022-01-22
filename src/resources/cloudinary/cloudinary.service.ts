import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import * as sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  async resizeImage(
    file: Express.Multer.File,
    width?: number,
    height?: number,
  ) {
    const resizedImage = await sharp(file.buffer)
      .resize(width, height)
      .toBuffer();
    if (!resizedImage)
      throw new BadRequestException('Oops! Something went wrong');
    return resizedImage;
  }

  async uploadImage(
    buffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(buffer).pipe(upload);
    });
  }
}
