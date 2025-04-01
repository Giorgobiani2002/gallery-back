import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ProductSchema } from 'src/products/schema/product.schema';
import { OrderSchema } from 'src/order/schema/order.schema';
import { AwsS3Service } from 'src/upload/aws-s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
      { name: 'order', schema: OrderSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AwsS3Service],
  exports: [UsersService],
})
export class UsersModule {}
