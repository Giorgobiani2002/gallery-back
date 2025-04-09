import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Gallery } from './schema/gallery.schema';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectModel('gallery') private galleryModel: Model<Gallery>,
    @InjectModel('product') private productModel: Model<Product>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}

  create(createGalleryDto: CreateGalleryDto) {
    return 'This action adds a new gallery';
  }
  async findAll(userId: string | null) {
    const user = userId ? await this.userModel.findById(userId) : null;

    const galleries = await this.galleryModel.find().populate('products');

    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].products.length > 0) {
        galleries[i].mainImgUrl = galleries[i].products[0].mainImgUrl;
        await galleries[i].save();
      }
    }

    const products = await this.productModel.find();

    if (user) {
      const favoriteProductIds = user.Favorites.map((id) => id.toString());

      products.forEach((product) => {
        product.isFavorite = favoriteProductIds.includes(
          product._id.toString(),
        );
      });
    } else {
      products.forEach((product) => {
        product.isFavorite = false;
      });
    }

    return galleries;
  }

  async findOne(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('not valid id');

    const user = userId ? await this.userModel.findById(userId) : null;

    const gallery = this.galleryModel.findById(id).populate({
      path: 'products',
      populate: {
        path: 'user',
        select: 'fullName email phoneNumber',
      },
    });

    const products = await this.productModel.find();

    if (user) {
      const favoriteProductIds = user.Favorites.map((id) => id.toString());

      products.forEach((product) => {
        product.isFavorite = favoriteProductIds.includes(
          product._id.toString(),
        );
      });
    } else {
      products.forEach((product) => {
        product.isFavorite = false;
      });
    }

    return gallery;
  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
