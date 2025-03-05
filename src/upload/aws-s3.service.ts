import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private storageService;
  private bucketName;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.storageService = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCES_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCES_KEY,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(filePath: string, file) {
    if (!filePath) return;

    try {
      const config = {
        Key: filePath,
        Bucket: this.bucketName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const uploadCommand = new PutObjectCommand(config);
      await this.storageService.send(uploadCommand);
      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async getFileById(filePath) {
    if (!filePath) return;

    try {
      const config = {
        Bucket: this.bucketName,
        Key: filePath,
      };

      const command = new GetObjectCommand(config);
      const fileStream = await this.storageService.send(command);

      if (fileStream.Body instanceof Readable) {
        const chunks = [];
        for await (let chunk of fileStream.Body) {
          chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);
        const b64 = fileBuffer.toString('base64');
        const file = `data:${fileStream.ContentType};base64,${b64}`;
        return file;
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      throw new Error('Failed to retrieve file');
    }
  }

  async deleteFileById(fileId: string) {
    if (!fileId) throw new Error('File ID is required');

    try {
      const config = {
        Bucket: this.bucketName,
        Key: fileId,
      };

      const command = new DeleteObjectCommand(config);
      await this.storageService.send(command);

      return fileId;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async generateSignedUrl(filePath: string, expiration: number = 60 * 5) {
    if (!filePath) throw new Error('File path is required');

    console.log(filePath, 'images/');
    try {
      const config = {
        Bucket: this.bucketName,
        Key: `images/${filePath}`,
      };

      const command = new GetObjectCommand(config);

      const signedUrl = await getSignedUrl(this.storageService, command, {
        expiresIn: expiration,
      });

      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }
}
