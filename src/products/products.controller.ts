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
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as jwt from 'jsonwebtoken'; 
import { ConfigService } from '@nestjs/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { SellerGuard } from 'src/auth/guards/seller.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(SellerGuard)
  @Post()
  create(
    @Headers('authorization') authorization: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotFoundException('Authorization header missing or invalid');
    }

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
  @UseGuards(SellerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(SellerGuard)
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
  