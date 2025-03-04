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
import { AppService } from './app.service';
import { AwsS3Service } from './upload/aws-s3.service';
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
  async generateSignedUrl(
    @Param('id') filePath: string,
    @Query('expiration') expiration: number = 60 * 5,
  ) {
    console.log(filePath, 'filePath');
    console.log(expiration, 'expiration');

    return this.appService.generateSignedUrl(filePath, expiration);
  }

  @Post('deleteFile')
  deleteFileById(@Body('fileId') fileId) {
    return this.appService.deleteFileById(fileId);
  }
}
