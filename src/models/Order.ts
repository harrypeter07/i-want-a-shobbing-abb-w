import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderDocument extends Document {
  orderId: string;
  items: Array<{
    shoeId: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    size: number;
    color: string;
    quantity: number;
  }>;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  shippingCost: number;
  discount: number;
  promoCode?: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderId: { type: String, required: true, unique: true },
    items: [
      {
        shoeId: { type: String, required: true },
        name: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        size: { type: Number, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    shippingMethod: { type: String, default: 'standard' },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    promoCode: { type: String },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'card' },
    status: { type: String, default: 'Processing' },
    trackingNumber: { type: String, required: true },
    estimatedDelivery: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
