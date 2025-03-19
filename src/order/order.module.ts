import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/schema/product.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { OrderSchema } from './schema/order.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
    EmailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
