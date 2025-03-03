import { Controller, Get, Post, Delete, Patch, Body, Param, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import mongoose from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    try {
      return this.cartService.getCartByUserId(new mongoose.Types.ObjectId(userId));
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  @Post(':userId')
  async addToCart(
    @Param('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      return this.cartService.addToCart(
        new mongoose.Types.ObjectId(userId),
        new mongoose.Types.ObjectId(productId),
        quantity
      );
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  @Delete(':userId/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    try {
      return this.cartService.removeFromCart(
        new mongoose.Types.ObjectId(userId),
        new mongoose.Types.ObjectId(productId)
      );
    } catch (error) {
      throw new NotFoundException('Cart or product not found');
    }
  }

  @Patch(':userId')
  async updateItemQuantity(
    @Param('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      return this.cartService.updateItemQuantity(
        new mongoose.Types.ObjectId(userId),
        new mongoose.Types.ObjectId(productId),
        quantity
      );
    } catch (error) {
      throw new NotFoundException('Cart or product not found');
    }
  }
}
