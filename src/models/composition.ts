import mongoose, { Document, Model, Schema } from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/index';

export interface Composition {
  _id?: string;
  name: string;
  type: TYPES;
  quantity_min: number;
  quantity_max: number;
  status: STATUS;
  companyId: string;
}

export enum STATUS {
  S = 'S',
  N = 'N',
}

export enum TYPES {
  ONE = 1,
  TWO = 2,
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: TYPES, required: true },
    quantity_min: {
      type: Number,
      required: true,
      min: [0, 'Path `quantity_min` is invalid.'],
    },
    quantity_max: {
      type: Number,
      required: true,
      min: [0, 'Path `quantity_max` is invalid.'],
    },
    status: { type: STATUS, required: true },
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

interface CompositionModel extends Omit<Composition, '_id'>, Document {}

/**
 * Validates the type and throws a validation errors, otherwise it will throw a 500
 */
schema.path('type').validate(
  async (type: number) => {
    return type == 1 || type == 2;
  },
  'Path `type` is invalid.',
  CUSTOM_VALIDATION.INVALID_TYPE
);

export const Composition: Model<CompositionModel> = mongoose.model(
  'Composition',
  schema
);
