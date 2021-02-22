import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Departament {
  _id?: string;
  name: string;
  companyId: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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

interface DepartamentModel extends Omit<Departament, '_id'>, Document {}

export const Departament: Model<DepartamentModel> = mongoose.model(
  'Departament',
  schema
);
