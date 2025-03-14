import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Order } from './schema/order.schema.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderService } from './order.service.js';
import { BuyerGuard } from 'src/auth/guards/seller.guard.js';
import { authGuard } from 'src/auth/guards/auth.guard.js';

@UseGuards(authGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.createOrder(createOrderDto);
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
