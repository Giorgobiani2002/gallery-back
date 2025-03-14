import {
  IsMongoId,
  IsArray,
  IsNumber,
  IsEnum,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schema/order.schema.js';

class OrderProductDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsMongoId()
  user: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  // @IsNumber()
  // @Min(0)
  // totalPrice: number;

  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
