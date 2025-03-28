import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GallerySchema } from './schema/gallery.schema';
import { ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'gallery', schema: GallerySchema },
      { name: 'product', schema: ProductSchema },
    ]),
  ],
  controllers: [GalleriesController],
  providers: [GalleriesService],
})
export class GalleriesModule {}
