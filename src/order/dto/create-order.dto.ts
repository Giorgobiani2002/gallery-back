// import {
//   IsMongoId,
//   IsString,
//   IsNumber,
//   IsOptional,
//   IsEnum,
// } from 'class-validator';

export class CreateOrderDto {
  paypalOrderId: string;

  totalPrice: number;
  status: string;
}
