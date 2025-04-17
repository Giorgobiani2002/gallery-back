import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Auction extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  })
  product: mongoose.Schema.Types.ObjectId;  

  @Prop({ type: Number, required: true })
  startingPrice: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: false, default: 0 })
  latestBidAmount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  winnerId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  latestBidder: mongoose.Schema.Types.ObjectId; 
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }])  // An array of users who participated
  users: mongoose.Schema.Types.ObjectId[];
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
