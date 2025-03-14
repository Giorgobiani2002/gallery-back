import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { AwsS3Service } from './upload/aws-s3.service.js';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly awsS3Service: AwsS3Service,
  ) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'file appContr');

    const path = Math.random().toString().slice(2);

    const type = file.mimetype.split('/')[1];
    const filePath = `images/${path}`;

    return this.appService.uploadFile(filePath, file);
  }

  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMany(@UploadedFiles() files: Express.Multer.File) {
    return this.appService.uploadFiles(files);
  }

  @Post('getFile')
  getFileById(@Body('fileId') fileId) {
    return this.appService.getFile(fileId);
  }

  @Get('generate-signed-url/:id')
  async generateSignedUrl(@Param('id') filePath: string) {
    console.log(filePath, 'filePath');

    return this.appService.generateSignedUrl(filePath);
  }

  @Post('deleteFile')
  deleteFileById(@Body('fileId') fileId) {
    return this.appService.deleteFileById(fileId);
  }
}
