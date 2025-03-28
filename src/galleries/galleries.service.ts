import { Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery } from './schema/gallery.schema';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectModel('gallery') private galleryModel: Model<Gallery>,
    @InjectModel('product') private productModel: Model<Product>,
  ) {}

  create(createGalleryDto: CreateGalleryDto) {
    return 'This action adds a new gallery';
  }
  async findAll() {
    const galleries = await this.galleryModel.find().populate('products');

    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].products.length > 0) {
        galleries[i].mainImgUrl = galleries[i].products[0].mainImgUrl;
        await galleries[i].save();
      }
    }

    return galleries;
  }

  findOne(id: number) {
    return `This action returns a #${id} gallery`;
  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
