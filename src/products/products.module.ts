import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AwsS3Module } from 'src/upload/aws-s3.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AwsS3Module,
    JwtModule,
    UsersModule,
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
