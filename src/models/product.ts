import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: STATUS;
  companyId: string;
  departamentId: string;
}

export enum STATUS {
  S = 'S',
  N = 'N',
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    price: { type: Number, required: true },
    status: { type: STATUS, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    departamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Departament',
      required: true,
    },
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

interface ProductModel extends Omit<Product, '_id'>, Document {}

export const Product: Model<ProductModel> = mongoose.model('Product', schema);
