import mongoose, { Schema, Document } from 'mongoose';

export interface IShoeDocument extends Document {
  id: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  colors: Array<{ name: string; hex: string; twClass?: string }>;
  sizes: number[];
  images: string[];
  tag?: string;
  description: string;
  specs: {
    weight: string;
    heelDrop: string;
    cushioning: string;
    upper: string;
    closure: string;
    traction: string;
  };
  reviews: Array<{
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    verified: boolean;
    fitFeedback: string;
  }>;
  releaseYear?: number;
  sku: string;
  createdAt: Date;
}

const ShoeSchema = new Schema<IShoeDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, default: 'Unisex' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 10 },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        twClass: { type: String },
      },
    ],
    sizes: [{ type: Number }],
    images: [{ type: String }],
    tag: { type: String },
    description: { type: String, required: true },
    specs: {
      weight: { type: String },
      heelDrop: { type: String },
      cushioning: { type: String },
      upper: { type: String },
      closure: { type: String },
      traction: { type: String },
    },
    reviews: [
      {
        id: { type: String },
        author: { type: String },
        avatar: { type: String },
        rating: { type: Number },
        date: { type: String },
        title: { type: String },
        comment: { type: String },
        verified: { type: Boolean, default: true },
        fitFeedback: { type: String },
      },
    ],
    releaseYear: { type: Number },
    sku: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Shoe || mongoose.model<IShoeDocument>('Shoe', ShoeSchema);
