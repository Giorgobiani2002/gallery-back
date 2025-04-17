import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface Product extends mongoose.Document {
  mainImgUrl: string;
  mockUpImgUrl: string;
  title: string;
  year: number;
  description: string;
  category: string;
  height: number;
  artist: string;
  ArtId: number;
  price: number;
  width: number;
  depth: number;
  isFavorite: boolean;
  features: boolean;
  user: mongoose.Schema.Types.ObjectId;
}

export const ProductSchema = new Schema({
  mainImgUrl: {
    type: String,
    required: true,
  },
  mockUpImgUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  artist: {
    type: String,
  },
  ArtId: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    required: true,
  },
  isFavorite: {
    type: Boolean,
  },
  features: {
    type: Boolean,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
