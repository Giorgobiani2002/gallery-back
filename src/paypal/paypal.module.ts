import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, CartModule, HttpModule],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
