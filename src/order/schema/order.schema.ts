import mongoose, { Schema, Document, model } from 'mongoose';

// Define the OrderStatus enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  products: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: OrderStatus;
}

// Define the Order schema
export const OrderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        }, // Reference to the Product model
        quantity: { type: Number, required: true, min: 1 }, // Quantity must be a positive number
        price: { type: Number, required: true }, // Price for each product
      },
    ],
    totalPrice: { type: Number, default: 0 }, // Default value set to 0
    status: {
      type: String,
      enum: Object.values(OrderStatus), // OrderStatus enum
      default: OrderStatus.PENDING, // Default status is pending
    },
  },
  { timestamps: true }, // Automatically adds `createdAt` and `updatedAt` timestamps
);

// Create the Order model
export const Order = model<IOrder>('Order', OrderSchema);
