import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/schema/product.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { OrderSchema } from './schema/order.schema';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
      { name: 'order', schema: OrderSchema },
    ]),
    EmailModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
