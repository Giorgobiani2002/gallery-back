import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { IOrder, Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { BuyerGuard } from 'src/auth/guards/seller.guard';
import { authGuard } from 'src/auth/guards/auth.guard';

@UseGuards(authGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<IOrder> {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async getAllOrders(): Promise<IOrder[]> {
    return await this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<IOrder> {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
