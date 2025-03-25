import mongoose, { Document, Schema, Model, model } from 'mongoose';
import { Role } from 'src/enums/roles.enum';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: number;
  passwordRepeat: string;
  products: mongoose.Schema.Types.ObjectId[];
  orders: mongoose.Schema.Types.ObjectId[];
  carts: mongoose.Schema.Types.ObjectId[];
  role: string;
  profileUrl: string;
  userBio: string;
  Favorites: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: Number },
    passwordRepeat: { type: String, select: false },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'product',
      default: [],
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'order',
      default: [],
    },
    carts: { type: [mongoose.Schema.Types.ObjectId], ref: 'cart', default: [] },
    role: { type: String, enum: Role, required: true },
    profileUrl: { type: String },
    userBio: { type: String },
    Favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'product',
      default: [],
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', UserSchema);
