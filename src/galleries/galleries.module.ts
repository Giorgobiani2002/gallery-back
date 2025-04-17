import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GallerySchema } from './schema/gallery.schema';
import { ProductSchema } from 'src/products/schema/product.schema';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'gallery', schema: GallerySchema },
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
    ]),
  ],
  controllers: [GalleriesController],
  providers: [GalleriesService],
})
export class GalleriesModule {}
