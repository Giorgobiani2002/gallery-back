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
import { QueryPaginationParamsDto } from './dto/query-params.dto';
import { QueryParamsLoadMoreDto } from './dto/query-params2-dto';

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
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotFoundException('Authorization header missing or invalid');
    }

    if (files.length < 2) {
      throw new Error('Both files (mainImg and mockUpImg) are required');
    }

    const [mainImg, mockUpImg] = files;

    const mainImgPath = Math.random().toString().slice(2);
    const FileMainImgPath = `images/${mainImgPath}`;
    const mockUpImgPath = Math.random().toString().slice(2);
    const FileMockUpImgPath = `images/${mockUpImgPath}`;

    await this.s3Service.uploadFile(FileMainImgPath, mainImg);
    await this.s3Service.uploadFile(FileMockUpImgPath, mockUpImg);

    const mainImgUrl = await this.s3Service.generateSignedUrl(mainImgPath);
    const mockUpImgUrl = await this.s3Service.generateSignedUrl(mockUpImgPath);

    createProductDto.mainImgUrl = mainImgUrl;
    createProductDto.mockUpImgUrl = mockUpImgUrl;

    const token = authorization.split(' ')[1];
    return this.productsService.create(token, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('Features')
  findFeatures(@Headers('authorization') authorization: string) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    return this.productsService.findFeatures(userId);
  }

  @Get('Select')
  findSelected(
    @Query() queryParams: QueryParamsLoadMoreDto,
    @Headers('authorization') authorization: string,
  ) {
    let userId = null;

    console.log(authorization);

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken, 'decodedToken');
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    console.log(userId, 'userId userId');

    return this.productsService.findSelected(queryParams, userId);
  }

  @Get('slice')
  async findOnePage(
    @Query() queryParams: QueryPaginationParamsDto,
    @Headers('authorization') authorization: string,
  ) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    const [data, totalCount] = await this.productsService.findOnePage(
      queryParams,
      userId,
    );

    return {
      data,
      totalCount,
    };
  }

  @Get('favorite')
  getMyFavorite(@Headers('authorization') authorization: string) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }
    return this.productsService.getMyFavorite(userId);
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post('favorites/:id')
  addFavorites(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    return this.productsService.addFavorites(id, userId);
  }

  @Get('getFavorites')
  GetFavorites(@Headers('authorization') authorization: string) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    return this.productsService.GetFavorites(userId);
  }

  @Get('Favorite')
  Favorites(@Headers('authorization') authorization: string) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    return this.productsService.Favorites(userId);
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
