import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ProductSchema } from 'src/products/schema/product.schema';
import { OrderSchema } from 'src/order/schema/order.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AwsS3Module } from 'src/upload/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
    JwtModule, // If you're using JwtService
    AwsS3Module,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
