import { IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  userId: string;
  @IsString()
  productId: string;
  @IsNumber()
  quantity: number;
}
