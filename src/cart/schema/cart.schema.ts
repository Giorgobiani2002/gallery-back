import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'user', required: true })
  user: mongoose.Types.ObjectId;

  @Prop([
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ])
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ type: Number, required: true })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
