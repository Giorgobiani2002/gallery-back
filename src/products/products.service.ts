import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { QueryPaginationParamsDto } from './dto/query-params.dto';
import { QueryParamsLoadMoreDto } from './dto/query-params2-dto';
import { ObjectId } from 'mongodb';
import { filter } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product') private productModel: Model<Product>,
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createProductDto: CreateProductDto) {
    const decoded = this.jwtService.decode(token) as { userId: string };

    if (!decoded || !decoded.userId) {
      throw new NotFoundException('User not found');
    }

    const userId = decoded.userId;

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const randomNum = Math.random().toString().slice(2, 6);

    const newProduct = new this.productModel({
      ...createProductDto,
      ArtId: randomNum,
      artist: user.fullName,
      user: user._id,
    });

    await newProduct.save();

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { products: newProduct._id },
    });

    return newProduct;
  }

  findAll() {
    return this.productModel.find();
  }

  async findSelected(
    { take, skip }: QueryParamsLoadMoreDto,
    userId: string | null,
  ) {
    const user = userId ? await this.userModel.findById(userId) : null;

    const products = await this.productModel
      .find()
      .populate({
        path: 'user',
        select:
          '-products -createdAt -__v -password -role -cart -orders -carts',
      })
      .skip(skip)
      .limit(take);

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
  async findOnePage(
    { page, take, sortBy, order, category }: QueryPaginationParamsDto,
    userId: string | null,
  ) {
    const user = userId ? await this.userModel.findById(userId) : null;

    const sortOptions = {};

    if (sortBy === 'price') {
      sortOptions['price'] = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'data') {
      sortOptions['createdAt'] = order === 'asc' ? 1 : -1;
    }

    const categoryFilter = category ? { category } : {};

    const products = await this.productModel
      .find(categoryFilter)
      .populate({
        path: 'user',
        select:
          '-products -createdAt -__v -password -role -cart -orders -carts',
      })
      .skip((page - 1) * take)
      .limit(take)
      .sort(sortOptions);

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

    const totalProducts =
      await this.productModel.countDocuments(categoryFilter);

    return [products, totalProducts];
  }
  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate({
      path: 'user',
      select: '-products -createdAt -__v -password -role -cart -orders -carts',
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async addFavorites(productId: string, userId: string | null) {
    console.log(productId, 'productId');
    console.log(userId, 'userId');

    const user = userId ? await this.userModel.findById(userId) : null;

    const productObjectId = new Types.ObjectId(productId);

    const existProduct = user.Favorites.some(
      (fav) => fav.toString() === productObjectId.toString(),
    );

    if (existProduct) {
      await this.userModel.updateOne(
        { _id: userId },
        { $pull: { Favorites: productId } },
      );
    } else {
      await this.userModel.updateOne(
        { _id: userId },
        { $push: { Favorites: productId } },
      );
    }
    const updatedUser = await this.userModel.findById(userId);

    return updatedUser?.Favorites;
  }
  async GetFavorites(userId: string | null) {
    if (userId) {
      const User = await this.userModel.findById(userId);

      return User.Favorites;
    } else {
      return [];
    }
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, updateProductDto);

    await product.save();

    return product;
  }

  async remove(id: string, userId: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.user.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this product',
      );
    }

    await this.productModel.findByIdAndDelete(id);

    await this.userModel.updateMany(
      { products: id },
      { $pull: { products: id } },
    );

    return { message: 'Product removed successfully' };
  }
}
