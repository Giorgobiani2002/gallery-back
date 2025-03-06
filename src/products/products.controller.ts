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
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/upload/aws-s3.service';
import { SellerGuard } from 'src/auth/guards/seller.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
    private s3Service: AwsS3Service,
  ) {}

  // @UseGuards(SellerGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Headers('authorization') authorization: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // console.log('Authorization:', authorization);
    // console.log('Files uploaded:', files);

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotFoundException('Authorization header missing or invalid');
    }

    if (files.length < 2) {
      throw new Error('Both files (mainImg and mockUpImg) are required');
    }

    const [mainImg, mockUpImg] = files;
    // console.log('Main Image:', mainImg);
    // console.log('Mock Up Image:', mockUpImg);

    const mainImgPath = Math.random().toString().slice(2);
    const FileMainImgPath = `images/${mainImgPath}`;
    const mockUpImgPath = Math.random().toString().slice(2);
    const FileMockUpImgPath = `images/${mockUpImgPath}`;

    // console.log('Main Image Path:', mainImgPath);
    // console.log('Mock Up Image Path:', mockUpImgPath);

    await this.s3Service.uploadFile(FileMainImgPath, mainImg);
    await this.s3Service.uploadFile(FileMockUpImgPath, mockUpImg);

    const mainImgUrl = await this.s3Service.generateSignedUrl(mainImgPath);
    const mockUpImgUrl = await this.s3Service.generateSignedUrl(mockUpImgPath);

    // console.log('Main Image URL:', mainImgUrl);
    // console.log('Mock Up Image URL:', mockUpImgUrl);

    createProductDto.mainImgUrl = mainImgUrl;
    createProductDto.mockUpImgUrl = mockUpImgUrl;

    const token = authorization.split(' ')[1];
    return this.productsService.create(token, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('Select')
  findSelected(
    @Query('take') take: number = 9,
    @Query('skip') skip: number = 0,
  ) {
    return this.productsService.findSelected(take, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  // @UseGuards(SellerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // @UseGuards(SellerGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization header missing or INVALID');
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      this.configService.get<string>('JWT_SECRET'),
    ) as { userId: string };

    return this.productsService.remove(id, decoded.userId);
  }
}
