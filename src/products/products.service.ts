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

    const newProduct = new this.productModel({
      ...createProductDto,
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
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
