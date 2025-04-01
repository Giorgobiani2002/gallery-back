import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';
import { CartService } from 'src/cart/cart.service';
import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { firstValueFrom } from 'rxjs';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaypalService {
  private client: paypal.core.PayPalHttpClient;
  private environment:
    | paypal.core.SandboxEnvironment
    | paypal.core.LiveEnvironment;

  constructor(
    private configService: ConfigService,
    private cartService: CartService,
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
  ) {
    const clientId =
      'Aa8H4ZRChcL8MUIEpJSxnxV4-a-yo4p9N3uv2VK5yIppum_3FRrRN5waq_0o6oyE7uplMLoMNOXBGWMS';
    const secret =
      'EN8qBeEToM16BKi78nOvhmNKHPKaPfLIFb-xxWA303bdzx8Snt1OKSNImRcMafvxT9_gUZm1OZoi8TIp';
    const mode = 'sandbox';

    if (mode === 'sandbox') {
      this.environment = new paypal.core.SandboxEnvironment(clientId, secret);
    } else {
      this.environment = new paypal.core.LiveEnvironment(clientId, secret);
    }

    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async getOAuthToken(): Promise<string> {
    const clientId =
      'Aa8H4ZRChcL8MUIEpJSxnxV4-a-yo4p9N3uv2VK5yIppum_3FRrRN5waq_0o6oyE7uplMLoMNOXBGWMS';
    const secret =
      'EN8qBeEToM16BKi78nOvhmNKHPKaPfLIFb-xxWA303bdzx8Snt1OKSNImRcMafvxT9_gUZm1OZoi8TIp';

    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

    const body = qs.stringify({
      grant_type: 'client_credentials',
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.sandbox.paypal.com/v1/oauth2/token',
          body,
          { headers },
        ),
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw new Error('Failed to fetch access token');
    }
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
    const returnUrl = `http://localhost:3000/paypal-success`;
    const cancelUrl = 'http://localhost:3000/paypal-cancel';

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
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    });

    try {
      const order = await this.client.execute(request);
      return order.result;
    } catch (err) {
      throw new Error('Error creating PayPal order');
    }
  }

  async capturePayment(orderId: string, payerId: string): Promise<any> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({
      payer_id: payerId,
    });

    try {
      const captureResponse = await this.client.execute(request);
      console.log('Payment captured successfully:', captureResponse);
      return captureResponse.result;
    } catch (error) {
      console.error('Error capturing payment:', error);
      throw new Error('Error capturing payment');
    }
  }
  async handlePaymentSuccess(orderId: string, payerId: string, token: string) {
    try {
      const paymentResult = await this.capturePayment(orderId, payerId);

      console.log('Payment result:', paymentResult);

      if (
        paymentResult &&
        paymentResult.purchase_units &&
        paymentResult.purchase_units[0] &&
        paymentResult.purchase_units[0].payments &&
        paymentResult.purchase_units[0].payments.captures &&
        paymentResult.purchase_units[0].payments.captures[0] &&
        paymentResult.purchase_units[0].payments.captures[0].amount
      ) {
        const totalPrice =
          paymentResult.purchase_units[0].payments.captures[0].amount.value;
        const status = paymentResult.status;
        const paypalOrderId = paymentResult.id;
        console.log(paypalOrderId, 'es aris paypal order ID');

        console.log('Total Price:', totalPrice);
        console.log('Status:', status);

        await this.orderService.createOrderFromPaypal(
          {
            paypalOrderId: paypalOrderId,
            totalPrice: totalPrice,
            status: status,
          },
          token,
        );
        if (!totalPrice || !status) {
          throw new Error('Missing totalPrice or status from PayPal response');
        }

        return {
          success: true,
          message: 'Payment captured successfully',
          orderId: orderId,
          paypalOrderId: paypalOrderId,
          status: status,
          totalPrice: totalPrice,
        };
      } else {
        console.error('Payment details are incomplete:', paymentResult);
        throw new Error('Payment details are incomplete or malformed');
      }
    } catch (error) {
      console.error('Error in capturing payment:', error);

      throw new Error('Error capturing PayPal payment');
    }
  }

  // Handle the success after payment capture
  // async handlePaymentSuccess(orderId: string, payerId: string) {
  //   try {
  //     const paymentResult = await this.capturePayment(orderId, payerId);

  //     if (paymentResult.status === 'COMPLETED') {
  //       return {
  //         success: true,
  //         message: 'Payment captured successfully',
  //         orderId: orderId,

  //       };
  //     } else {
  //       throw new Error('Payment capture failed');
  //     }
  //   } catch (error) {
  //     console.error('Error in capturing payment:', error);
  //     throw new Error('Error capturing PayPal payment');
  //   }
  // }
}
