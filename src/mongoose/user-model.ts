import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface User extends mongoose.Document {
  fullName: string;
  age: number;
  email: string;
  phoneNumber: number;
  // password: string;
  // passwordRepeat: string;
  products: mongoose.Schema.Types.ObjectId[];
  orders: mongoose.Schema.Types.ObjectId[];
  carts: mongoose.Schema.Types.ObjectId[];
  role: string;
  // profileUrl: string;
  // userBio: string;
  favorites: mongoose.Schema.Types.ObjectId[];
  verification: boolean;
}

export const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // password: {
  //   type: String,
  //   select: false,
  //   required: true,
  // },
  // passwordRepeat: {
  //   type: String,
  //   select: false,
  //   required: true,
  // },
  phoneNumber: {
    type: Number,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Order',
    default: [],
  },
  carts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Cart',
    default: [],
  },
  role: {
    type: String,
    enum: ['seller', 'buyer'],
    required: true,
  },
  // profileUrl: {
  //   type: String,
  //   required: false,
  // },
  // userBio: {
  //   type: String,
  //   required: false,
  // },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  verification: {
    type: Boolean,
  },
});
