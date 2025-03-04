import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum Category {
  PAINTING = 'painting',
  PHOTOGRAPHY = 'photography',
  SCULPTURE = 'sculpture',
  MIXEDMEDIA = 'mixedmedia',
}

@Schema()
export class Product extends Document {
  @Prop({ type: String, required: true })
  mainImgUrl: string;

  @Prop({ type: String, required: true })
  mockUpImgUrl: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, required: true })
  year: number;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, enum: Category, required: true })
  category: Category;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: 0 })
  total: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
