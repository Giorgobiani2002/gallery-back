import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { QueryPaginationParamsDto } from './dto/query-params.dto';
import { QueryParamsLoadMoreDto } from './dto/query-params2-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('User') private userModel: Model<User>,
    private readonly jwtService: JwtService,
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

  findSelected({ take, skip }: QueryParamsLoadMoreDto) {
    return this.productModel
      .find()
      .populate({
        path: 'user',
        select:
          '-products -createdAt -__v -password -role -cart -orders -carts',
      })
      .skip(skip)
      .limit(take);
  }

  findOnePage({
    page,
    take,
    sortBy,
    order,
    category,
  }: QueryPaginationParamsDto) {
    const sortOptions = {};

    console.log(
      `Fetching data with parameters: page=${page}, take=${take}, sortBy=${sortBy}, order=${order}, category=${category}`,
    );

    if (sortBy === 'price') {
      sortOptions['price'] = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'data') {
      sortOptions['createdAt'] = order === 'asc' ? 1 : -1;
    }

    console.log('Sort Options:', sortOptions);

    const categoryFilter = category ? { category } : {};

    return Promise.all([
      this.productModel
        .find(categoryFilter)
        .populate({
          path: 'user',
          select:
            '-products -createdAt -__v -password -role -cart -orders -carts',
        })
        .skip((page - 1) * take)
        .limit(take)
        .sort(sortOptions),

      this.productModel.countDocuments(categoryFilter),
    ]);
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
