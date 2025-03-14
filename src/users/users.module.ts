import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema.js';
import { ProductSchema } from 'src/products/schema/product.schema.js';
import { OrderSchema } from 'src/order/schema/order.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
      { name: 'order', schema: OrderSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
