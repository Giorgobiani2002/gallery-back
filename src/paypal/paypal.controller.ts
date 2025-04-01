import {
  Controller,
  Post,
  Param,
  NotFoundException,
  Get,
  Headers,
  BadRequestException,
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

  @Post('capture-payment/:orderId/:payerID')
  async capturePayment(
    @Param('orderId') orderId: string,
    @Param('payerID') payerId: string,
    @Headers('Authorization') authorization: string,  // Extract the Authorization header
  ) {
    console.log('Received params:', { orderId, payerId });

    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization token is required and should be in "Bearer <token>" format');
    }

    // Extract token by removing "Bearer " from the Authorization header
    const token = authorization.replace('Bearer ', '').trim();

    try {
      const paymentResult = await this.paypalService.handlePaymentSuccess(
        orderId,
        payerId,
        token, // Pass the extracted token
      );
      console.log(paymentResult);

      return paymentResult;
    } catch (error) {
      console.error('Error capturing payment:', error);
      throw new Error('Error capturing payment');
    }
  }
}