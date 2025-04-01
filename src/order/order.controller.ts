import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { authGuard } from 'src/auth/guards/auth.guard';

// @UseGuards(authGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ): Promise<Order> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new NotFoundException('Token is required');
    }

    return await this.orderService.createOrderFromPaypal(createOrderDto, token);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return await this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<Order> {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
