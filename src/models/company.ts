import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Company {
  _id?: string;
  name: string;
  cnpj: string;
  userId: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cnpj: {
      type: String,
      required: true,
      unique: [true, 'CNPJ must be unique'],
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

interface CompanyModel extends Omit<Company, '_id'>, Document {}

/**
 * Validates the cnpj and throws a validation errors, otherwise it will throw a 500
 */
schema.path('cnpj').validate(
  async (cnpj: string) => {
    const cnpjCount = await mongoose.models.Company.countDocuments({ cnpj });
    return !cnpjCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

export const Company: Model<CompanyModel> = mongoose.model('Company', schema);
