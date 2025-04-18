import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface Auction extends mongoose.Document {
  product: mongoose.Schema.Types.ObjectId;
  startingPrice: number;
  startDate: Date;
  endDate: Date;
  latestBidAmount: number;
  winnerId?: mongoose.Schema.Types.ObjectId;
  latestBidder?: mongoose.Schema.Types.ObjectId;
  users: mongoose.Schema.Types.ObjectId[];
}

export const AuctionSchema = new Schema<Auction>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  latestBidAmount: {
    type: Number,
    default: 0,
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  latestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});
