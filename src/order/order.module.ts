import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Order, OrderSchema } from './schema/order.schema';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    EmailModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
