import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsLoadMoreDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number = 9;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  skip: number = 0;

  @Transform(({ value }) => String(value))
  @IsOptional()
  category: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  year: number;

  @IsString()
  @IsOptional()
  artist: string;
}
