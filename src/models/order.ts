import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Order {
  _id?: string;
  number: string;
  number_of_customers: number;
  // status: string;
  amount: number;
  companyId: string;
}

const schema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    number_of_customers: { type: Number, required: true },
    // status: { type: String, required: true },
    amount: { type: Number, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

interface OrderModel extends Omit<Order, '_id'>, Document {}

export const Order: Model<OrderModel> = mongoose.model('Order', schema);
