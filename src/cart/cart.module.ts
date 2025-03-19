import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/schema/product.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { CartSchema } from './schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Cart', schema: CartSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
