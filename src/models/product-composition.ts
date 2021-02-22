import mongoose, { Document, Model, Schema } from 'mongoose';
import { STATUS } from '@src/models/index';

export interface ProductComposition {
  _id?: string;
  status: STATUS;
  productId: string;
  compositionId: string;
}

const schema = new mongoose.Schema(
  {
    status: { type: STATUS, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    compositionId: {
      type: Schema.Types.ObjectId,
      ref: 'Composition',
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

interface ProductCompositionModel
  extends Omit<ProductComposition, '_id'>,
    Document {}

export const ProductComposition: Model<ProductCompositionModel> = mongoose.model(
  'ProductComposition',
  schema
);
