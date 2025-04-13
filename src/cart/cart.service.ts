import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('cart') private readonly cartModel: Model<Cart>,
    @InjectModel('product') private readonly productModel: Model<Product>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}

  async getCartByUserId(userId: mongoose.Types.ObjectId): Promise<Cart> {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [], totalPrice: 0 });
      await cart.save();
    }

    return cart;
  }

  async addToCart(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    quantity: number,
  ): Promise<Cart> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    // Find the user's cart
    let cart = await this.cartModel.findOne({ user: userId });
    
    // If the user doesn't have a cart, create a new one
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [], totalPrice: 0 });
    }
  
    // Find if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString(),
    );
  
    
    if (existingItemIndex >= 0) {
      const existingItem = cart.items[existingItemIndex];
      existingItem.quantity = quantity; 
      existingItem.price = product.price * quantity; 
    } else {
      
      cart.items.push({
        product: productId, 
        quantity, 
        price: product.price * quantity,
      });
    }
  
   
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
  
   
    await cart.save();
  
   
    const cartId = cart._id as mongoose.Schema.Types.ObjectId;
    const user = await this.userModel.findById(userId);
    
    
    if (user) {
     
      if (!user.carts.includes(cartId)) {
        user.carts.push(cartId);
        await user.save(); 
      }
    }
  
    return cart;
  }
  

  async removeFromCart(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
  ): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString(),
    );
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();

    return cart;
  }

  async updateItemQuantity(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    item.quantity = quantity;
    item.price = (await this.productModel.findById(productId)).price * quantity;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();

    return cart;
  }
  async clearCart(userId: mongoose.Types.ObjectId): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  
    return cart;
  }

}
