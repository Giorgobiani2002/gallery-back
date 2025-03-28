import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';

@Schema()
export class Gallery extends Document {
  @Prop({ type: String })
  mainImgUrl: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  addres: string;

  @Prop({ type: String, required: true })
  info: string;

  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] })
  products: Product[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
