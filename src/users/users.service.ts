import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('product') private productModel: Model<Product>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll() {
    return this.userModel
      .find()
      .populate('orders')
      .populate('products')
      .populate('orders.products')
      .exec();
  }
  async updateProfileImage(
    userId: string,

    profileImgUrl: string,
    userBio: string,
  ) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
      profileUrl: profileImgUrl,
      userBio,
    });
    return updatedUser;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).populate({
      path: 'products',
      select: '-createdAt -__v',
      populate: {
        path: 'user',
        select: 'fullName email role',
      },
    });
    return user;
  }

  async findArtist(id: string, userId: string) {
    const user = userId ? await this.userModel.findById(userId) : null;

    const artist = await this.userModel.findById(id);
    if (!artist) {
      throw new Error('Artist not found');
    }

    const products = await this.productModel.find({ user: id }).populate({
      path: 'user',
      select: '_id',
    });

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

    return products;
  }

  async getAllArtists() {
    return this.userModel
      .find({ role: 'seller' })
      .select(
        '-products -createdAt -__v -password -role -cart -orders -carts -email',
      );
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email: email })
      .select('+password');
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return updateUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    return deletedUser;
  }
}
