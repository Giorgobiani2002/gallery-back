import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { User } from 'src/users/schema/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt'; // Import the JwtService for token decoding
import { ObjectId } from 'mongoose'; // Import ObjectId for casting

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('order') private readonly orderModel: Model<Order>,
    @InjectModel('user') private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async createOrderFromPaypal(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<Order> {
    const { paypalOrderId, totalPrice, status } = createOrderDto;
    console.log(paypalOrderId, 'es aris aidii');
    console.log(totalPrice, 'es aris praisi');
    console.log(status, 'es aris statusi');
    console.log(token);

    // Decode the token
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token); // Verify the token using jwtService
      console.log('Decoded Token:', decodedToken);

      if (!decodedToken || !decodedToken.userId) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (error) {
      console.log('Error during token verification:', error);
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.userId;

    // Fetch the user from the database using the user ID extracted from the token
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Ensure totalPrice and status are provided
    if (!totalPrice || !status) {
      throw new Error('Missing total price or status');
    }

    // Create a new order
    const newOrder = new this.orderModel({
      paypalOrderId: paypalOrderId,
      totalPrice: totalPrice, // store as string or number based on your choice
      status: status || 'pending',
      date: new Date(),
    });
    console.log(newOrder);

    // Save the order to the database
    const savedOrder: Order = await newOrder.save();
    console.log(savedOrder, 'thats a saved order');

    existingUser.orders.push(savedOrder._id as ObjectId);
    // Save the updated user document with the new order
    await existingUser.save();

    // Optionally, send a confirmation email
    // await this.emailService.sendEmail(
    //   existingUser.email,
    //   'Order Confirmation',
    //   `Thank you for your order! Your PayPal order ID is: ${savedOrder.paypalOrderId}`,
    //   `<p>Thank you for your order!</p><p>Your PayPal order ID is: <b>${savedOrder.paypalOrderId}</b></p><p>Total Price: $${savedOrder.totalPrice}</p>`,
    // );

    return savedOrder;
  }
  

  async getAllOrders(): Promise<Order[]> {
    return await this.orderModel.find().populate('user').exec();
  }

  async getOrderById(orderId: string): Promise<Order> {
    const objectId = new mongoose.Types.ObjectId(orderId);

    console.log(objectId);
    const order = await this.orderModel.findById(objectId).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
