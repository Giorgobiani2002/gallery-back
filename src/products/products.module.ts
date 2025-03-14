import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema.js';
import { UserSchema } from 'src/users/schema/user.schema.js';
import { JwtModule } from '@nestjs/jwt';
import { AwsS3Module } from 'src/upload/aws-s3.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
    ]),
    AwsS3Module,
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
