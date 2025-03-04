import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './upload/aws-s3.service';

@Injectable()
export class AppService {
  constructor(private s3Service: AwsS3Service) {}

  getHello(): string {
    return 'Hello World!';
  }

  uploadFile(filePath, file) {
    return this.s3Service.uploadFile(filePath, file);
  }

  async uploadFiles(files) {
    const fileIds = [];

    for (let file of files) {
      const path = Math.random().toString().slice(2);
      const filePath = `images/${path}`;

      const fileId = await this.s3Service.uploadFile(filePath, file);

      fileIds.push(fileId);
    }
    return fileIds;

    // return this.s3Service.uploadFile(filePath, file);
  }
  getFile(fileId) {
    return this.s3Service.getFileById(fileId);
  }

  generateSignedUrl(filePath, expiration) {
    return this.s3Service.generateSignedUrl(filePath, expiration);
  }

  deleteFileById(fileId) {
    return this.s3Service.deleteFileById(fileId);
  }
}
