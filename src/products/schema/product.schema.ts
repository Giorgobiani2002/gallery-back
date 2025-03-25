import { Schema, model, Types, Document } from 'mongoose';

export enum Category {
  PAINTING = 'painting',
  PHOTOGRAPHY = 'photography',
  SCULPTURE = 'sculpture',
  MIXEDMEDIA = 'mixedmedia',
}

export interface IProduct extends Document {
  mainImgUrl: string;
  mockUpImgUrl: string;
  title: string;
  year: number;
  description: string;
  category: Category;
  height: number;
  artist?: string;
  ArtId?: number;
  price: number;
  width: number;
  depth: number;
  isFavorite?: boolean;
  user: Types.ObjectId; // Reference to the User model (ObjectId)
}

export const ProductSchema = new Schema<IProduct>(
  {
    mainImgUrl: { type: String, required: true },
    mockUpImgUrl: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    height: { type: Number, required: true },
    artist: { type: String },
    ArtId: { type: Number },
    price: { type: Number, required: true },
    width: { type: Number, required: true },
    depth: { type: Number, required: true },
    isFavorite: { type: Boolean },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user', // Reference to the 'User' model
      required: true,
    },
  },
  { timestamps: true },
);

// Export the Product model and ProductSchema
export const Product = model<IProduct>('Product', ProductSchema);
