import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/schema/product.schema.js';
import { UserSchema } from 'src/users/schema/user.schema.js';
import { OrderSchema } from './schema/order.schema.js';
import { EmailModule } from 'src/email/email.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
      { name: 'order', schema: OrderSchema },
    ]),
    EmailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
