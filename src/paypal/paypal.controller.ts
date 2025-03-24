import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
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

  @Post('capture/:orderId')
  async capturePayment(@Param('orderId') orderId: string) {
    try {
      const captureResult = await this.paypalService.capturePayment(orderId);

      await this.cartService.clearCart(captureResult.userId);

      return captureResult;
    } catch (err) {
      throw new NotFoundException('Error capturing PayPal payment');
    }
  }
}
