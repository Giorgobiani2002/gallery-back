import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../schema/product.schema.js';
import { Type } from 'class-transformer';

export class CreateProductDto {
  // @IsNotEmpty()
  // @IsString()
  mainImgUrl: string;

  // @IsNotEmpty()
  // @IsString()
  mockUpImgUrl: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  // @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

  @IsNotEmpty()
  // @IsNumber()
  width: number;

  @IsNotEmpty()
  // @IsNumber()
  height: number;

  @IsNotEmpty()
  // @IsNumber()
  price: number;

  // @IsNotEmpty()
  // @Type(() => Number)
  // // @IsNumber()
  // total: number;
}
