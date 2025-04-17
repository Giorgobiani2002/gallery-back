import { Module } from '@nestjs/common';
import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionBiddingController } from './auction-bidding.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule
import { AuctionSchema } from './schema/auction-bidding.schema';
import { ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'auction', schema: AuctionSchema },
      { name: 'product', schema: ProductSchema },
    ]),
    JwtModule.register({
      secret: 'GELASUYVARSMAWONI',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuctionBiddingController],
  providers: [AuctionBiddingService],
})
export class AuctionBiddingModule {}
