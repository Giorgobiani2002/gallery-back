import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user-model';
import { ProductSchema } from './product-model';
import { OrderSchema } from './order-model';
import { CartSchema } from './cart-model';
import { GallerySchema } from './gallery-model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'Gallery', schema: GallerySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseSchemasModule {}
