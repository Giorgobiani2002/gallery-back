import { Module } from '@nestjs/common';
import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionBiddingController } from './auction-bidding.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule
import { AuctionSchema } from './schema/auction-bidding.schema';
import { ProductSchema } from 'src/products/schema/product.schema';
import { UserSchema } from 'src/mongoose/user-model';
import { UsersModule } from 'src/users/users.module';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { PaypalModule } from 'src/paypal/paypal.module';
import { CartSchema } from 'src/mongoose/cart-model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'auction', schema: AuctionSchema },
      { name: 'product', schema: ProductSchema },
      { name: 'user', schema: UserSchema },
      { name: 'cart', schema: CartSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    PaypalModule,
  ],
  controllers: [AuctionBiddingController],
  providers: [AuctionBiddingService, EmailSenderService],
})
export class AuctionBiddingModule {}
