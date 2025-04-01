import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ type: String,  unique: true })
  paypalOrderId: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: Number })
  totalPrice: number;
  @Prop({ type: String })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
