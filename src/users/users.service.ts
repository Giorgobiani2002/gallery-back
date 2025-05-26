import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.userModel.find().populate('orders').populate('products').exec();
  }
  async updateProfileImage(
    userId: string,
    profileImgUrl: string,
    userBio: string,
    userBioGEO: string,
  ) {
    if (profileImgUrl !== null) {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
        profileUrl: profileImgUrl,
        userBio,
      });
      return updatedUser;
    } else {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
        userBio,
        userBioGEO,
      });
      return updatedUser;
    }
  }

  async findOne(id: string) {
    // Fetch user and populate both orders and products
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'products', // Populate the 'products' field in the user
        select: '-createdAt -__v', // Exclude fields like createdAt and __v
        populate: {
          path: 'user', // Inside products, populate the 'user' field
          select: 'fullName email role', // Only fetch these fields from the product's user
        },
      })
      .populate({
        path: 'orders', // Populate the 'orders' field in the user
        select: '-__v', // Exclude __v from the orders
        populate: {
          path: 'user', // Inside orders, populate the 'user' field
          select: 'fullName email role', // Only fetch these fields from the order's user
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
      .find({ role: 'seller', verification: true })
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

  async getSuggestions(query: string) {
    const searchRegex = new RegExp(query, 'i');

    const artworks = await this.productModel
      .find(
        {
          $or: [{ title: searchRegex }, { titleGEO: searchRegex }],
        },
        {
          _id: 1,
          title: 1,
          titleGEO: 1,
          mainImgUrl: 1,
        },
      )
      .limit(5);

    const artists = await this.userModel
      .find(
        {
          $or: [{ fullName: searchRegex }, { fullNameGEO: searchRegex }],
          verification: true,
        },
        {
          _id: 1,
          fullName: 1,
          fullNameGEO: 1,
          profileUrl: 1,
        },
      )
      .limit(5);

    if (artworks.length === 0 && artists.length === 0) {
      throw new NotFoundException('შესაბამისობა ვერ მოიძებნა');
    }

    return { artworks, artists };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto, 'updateUserDto');
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
