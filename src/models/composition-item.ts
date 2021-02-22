import mongoose, { Document, Model, Schema } from 'mongoose';
import { STATUS } from '@src/models/index';

export interface CompositionItem {
  _id?: string;
  name: string;
  quantity_max: number;
  value: number;
  pre_selected_quantity: number;
  status: STATUS;
  compositionId: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity_max: {
      type: Number,
      required: true,
      min: [0, 'Path `quantity_max` is invalid.'],
    },
    value: {
      type: Number,
      required: true,
      min: [0, 'Path `value` is invalid.'],
    },
    pre_selected_quantity: {
      type: Number,
      required: true,
      min: [0, 'Path `pre_selected_quantity` is invalid.'],
    },
    status: { type: STATUS, required: true },
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

interface CompositionItemModel extends Omit<CompositionItem, '_id'>, Document {}

export const CompositionItem: Model<CompositionItemModel> = mongoose.model(
  'CompositionItem',
  schema
);
