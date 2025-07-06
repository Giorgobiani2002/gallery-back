import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [ConfigModule, CartModule, HttpModule, OrderModule],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}
