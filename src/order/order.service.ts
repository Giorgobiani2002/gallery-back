import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('order') private readonly orderModel: Model<Order>,
    @InjectModel('product') private readonly productModel: Model<Product>,
    @InjectModel('user') private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user, products } = createOrderDto;

    // Validate user exists
    const existingUser = await this.userModel.findById(user);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    let totalPrice = 0;
    const updatedProducts = [];

    // Validate products and calculate total price
    for (const item of products) {
      const existingProduct = await this.productModel.findById(item.product);
      if (!existingProduct) {
        throw new NotFoundException(
          `Product with ID ${item.product} not found`,
        );
      }

      // Use product's actual price
      const price = existingProduct.price;
      totalPrice += price * item.quantity;

      updatedProducts.push({
        product: item.product,
        quantity: item.quantity,
        price, // Store product's price in order
      });
    }

    const newOrder = new this.orderModel({
      user,
      products: updatedProducts,
      totalPrice,
      status: createOrderDto.status || 'pending',
    });

    const savedOrder = await newOrder.save();

    
    await this.emailService.sendEmail(
      existingUser.email, // Send to user's email
      'Order Confirmation',
      `Thank you for your order! Your order ID is: ${savedOrder._id}`,
      `<p>Thank you for your order!</p><p>Your order ID is: <b>${savedOrder._id}</b></p><p>Total Price: $${savedOrder.totalPrice}</p>`,
    );

    return savedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderModel
      .find()
      .populate('user')
      .populate('products.product')
      .exec();
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel
      .findById(orderId)
      .populate('user')
      .populate('products.product')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
