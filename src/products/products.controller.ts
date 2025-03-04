import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Headers,
  UnauthorizedException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as jwt from 'jsonwebtoken'; // Import JWT module
import { ConfigService } from '@nestjs/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/upload/aws-s3.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
    private s3Service: AwsS3Service,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Headers('authorization') authorization: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('Authorization:', authorization);
    console.log('Files uploaded:', files);

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotFoundException('Authorization header missing or invalid');
    }

    if (files.length < 2) {
      throw new Error('Both files (mainImg and mockUpImg) are required');
    }

    const [mainImg, mockUpImg] = files;
    console.log('Main Image:', mainImg);
    console.log('Mock Up Image:', mockUpImg);

    const mainImgPath = Math.random().toString().slice(2);
    const FileMainImgPath = `images/${mainImgPath}`;
    const mockUpImgPath = Math.random().toString().slice(2);
    const FileMockUpImgPath = `images/${mockUpImgPath}`;

    console.log('Main Image Path:', mainImgPath);
    console.log('Mock Up Image Path:', mockUpImgPath);

    await this.s3Service.uploadFile(FileMainImgPath, mainImg);
    await this.s3Service.uploadFile(FileMockUpImgPath, mockUpImg);

    const mainImgUrl = await this.s3Service.generateSignedUrl(
      mainImgPath,
      300000,
    );
    const mockUpImgUrl = await this.s3Service.generateSignedUrl(
      mockUpImgPath,
      300000,
    );

    console.log('Main Image URL:', mainImgUrl);
    console.log('Mock Up Image URL:', mockUpImgUrl);

    createProductDto.mainImg = mainImgUrl;
    createProductDto.mockUpImg = mockUpImgUrl;

    const token = authorization.split(' ')[1];
    return this.productsService.create(token, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
