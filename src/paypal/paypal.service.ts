import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';
import { CartService } from 'src/cart/cart.service';
import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class PaypalService {
  private client: paypal.core.PayPalHttpClient;
  private environment:
    | paypal.core.SandboxEnvironment
    | paypal.core.LiveEnvironment;

  constructor(
    private configService: ConfigService,
    private cartService: CartService,
  ) {
    const clientId =
      'Aa8H4ZRChcL8MUIEpJSxnxV4-a-yo4p9N3uv2VK5yIppum_3FRrRN5waq_0o6oyE7uplMLoMNOXBGWMS';
    const secret =
      'EN8qBeEToM16BKi78nOvhmNKHPKaPfLIFb-xxWA303bdzx8Snt1OKSNImRcMafvxT9_gUZm1OZoi8TIp';
    const mode = 'sandbox';
    console.log('Client ID:', clientId);
    console.log('Secret:', secret);
    console.log('Mode:', mode);

    if (mode === 'sandbox') {
      this.environment = new paypal.core.SandboxEnvironment(clientId, secret);
    } else {
      this.environment = new paypal.core.LiveEnvironment(clientId, secret);
    }

    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(userId: string) {
    const cart = await this.cartService.getCartByUserId(
      new mongoose.Types.ObjectId(userId),
    );
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const total = cart.totalPrice;
    const currency = 'USD';

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: total.toString(),
          },
          description: 'Items in Cart',
        },
      ],
    });

    try {
      const order = await this.client.execute(request);
      return order.result;
    } catch (err) {
      console.error('Error creating PayPal order:', err);
      throw new Error('Error creating PayPal order');
    }
  }

  async capturePayment(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.prefer('return=representation');

    try {
      const capture = await this.client.execute(request);
      return capture.result;
    } catch (err) {
      console.error('Error capturing PayPal payment:', err);
      throw new Error('Error capturing PayPal payment');
    }
  }
}
