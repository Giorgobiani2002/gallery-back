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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as jwt from 'jsonwebtoken'; // Import JWT module
import { ConfigService } from '@nestjs/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/upload/aws-s3.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
    private s3Service: AwsS3Service,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('mainImg'))
  async create(
    @Headers('authorization') authorization: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotFoundException('Authorization header missing or invalid');
    }

    if (!file) {
      throw new Error('No file uploaded');
    }

    console.log('Uploaded file:', file);

    const token = authorization.split(' ')[1];

    const path = Math.random().toString().slice(2);
    const filePath = `images/${path}`;

    await this.s3Service.uploadFile(filePath, file);

    // const expiration = 60 * 5;

    const fileUrl = await this.s3Service.generateSignedUrl(path, 300000);

    createProductDto.mainImg = fileUrl;

    console.log(file);

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
