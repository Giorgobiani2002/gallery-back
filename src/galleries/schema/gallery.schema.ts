import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Gallery extends Document {
  @Prop({ type: String, required: true })
  mainImgUrl: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  addres: string;

  @Prop({ type: String, required: true })
  info: string;

  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'product', default: [] })
  products: mongoose.Schema.Types.ObjectId[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
