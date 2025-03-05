import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { UserSchema } from 'src/users/schema/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
    ]),
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
