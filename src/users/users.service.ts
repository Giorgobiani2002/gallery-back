import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}
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
