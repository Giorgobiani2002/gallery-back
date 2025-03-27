import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user-model';
import { ProductSchema } from './product-model';
import { OrderSchema } from './order-model';
import { CartSchema } from './cart-model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Cart', schema: CartSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseSchemasModule {}
