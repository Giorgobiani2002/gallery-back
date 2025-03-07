import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class QueryPaginationParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number = 10;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number = 1;
}
