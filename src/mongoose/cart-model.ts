import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface Cart extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  items: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
