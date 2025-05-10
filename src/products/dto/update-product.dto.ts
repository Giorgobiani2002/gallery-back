import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Category } from '../schema/product.schema';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  mainImgUrl?: string;

  @IsOptional()
  @IsString()
  mockUpImgUrl?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleGEO?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionGEO?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}
