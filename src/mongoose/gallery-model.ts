import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface Gallery extends mongoose.Document {
  //   mainImgUrl: string;
  name: string;
  nameGEO: string;
  addres: string;
  addresGEO: string;
  info: string;
  infoGEO: string;
  details: string;
  detailsGEO: string;
  products: mongoose.Schema.Types.ObjectId;
}

export const GallerySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nameGEO: {
    type: String,
    required: true,
  },
  addres: {
    type: String,
    required: true,
  },
  addresGEO: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  infoGEO: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  detailsGEO: {
    type: String,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
});
