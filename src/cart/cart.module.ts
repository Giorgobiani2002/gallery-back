import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/schema/product.schema.js';
import { UserSchema } from 'src/users/schema/user.schema.js';
import { CartSchema } from './schema/cart.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
      { name: 'cart', schema: CartSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
