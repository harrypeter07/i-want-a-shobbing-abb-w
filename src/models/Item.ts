import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
