import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Gallery {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  mainDesc: string;

  @Prop({ type: String, required: true })
  desc: string;

  @Prop({ type: String, required: true })
  adrres: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'product', default: [] })
  GalleryArts: mongoose.Schema.Types.ObjectId[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
