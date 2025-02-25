import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ type: String })
  fullName: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String, select: false })
  password: string;
  //   @Prop({ type: Number })
  //   phoneNumber: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
