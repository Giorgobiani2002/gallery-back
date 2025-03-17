import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/enums/roles.enum';

@Schema()
export class User {
  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: Number })
  phoneNumber: number;

  @Prop({ type: String, select: false })
  passwordRepeat: string;

  // @Prop({ type: String })
  // photoUrl: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'product', default: [] })
  products: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'order', default: [] })
  orders: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'cart', default: [] })
  carts: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String, enum: Role, required: true })
  role: string;

  @Prop({ type: String })
  profileUrl: string;

  @Prop({ type: String })
  userBio: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
