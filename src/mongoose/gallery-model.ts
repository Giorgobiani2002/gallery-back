import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface Gallery extends mongoose.Document {
  //   mainImgUrl: string;
  name: string;
  addres: string;
  info: string;
  details: string;
  products: mongoose.Schema.Types.ObjectId;
}

export const GallerySchema = new Schema({
  //   mainImgUrl: {
  //     type: String,
  //     required: true,
  //   },
  name: {
    type: String,
    required: true,
  },
  addres: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
});
