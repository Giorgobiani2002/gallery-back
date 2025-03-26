import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { AwsS3Service } from 'src/upload/aws-s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AwsS3Service],
  exports: [UsersService],
})
export class UsersModule {}
