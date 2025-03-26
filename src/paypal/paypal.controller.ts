import {
  Controller,
  Post,
  Param,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CartService } from 'src/cart/cart.service';

@Controller('paypal')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly cartService: CartService,
  ) {}

  @Post('create-order/:userId')
  async createOrder(@Param('userId') userId: string) {
    try {
      const order = await this.paypalService.createOrder(userId);
      console.log(order);
      return { orderId: order.id, links: order.links };
    } catch (err) {
      throw new NotFoundException('Error creating PayPal order');
    }
  }
  @Get('get-token')
  async getToken(): Promise<string> {
    return this.paypalService.getOAuthToken();
  }
  @Post('capture-payment/:orderId')
  async capturePayment(@Param('orderId') orderId: string) {
    try {
      const captureResult = await this.paypalService.capturePayment(orderId);
      return { message: 'Payment captured successfully', captureResult };
    } catch (error) {
      return { message: 'Error capturing payment', error: error.message };
    }
  }
  
}
