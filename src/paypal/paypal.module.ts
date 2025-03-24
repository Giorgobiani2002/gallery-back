import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [ConfigModule, CartModule],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
