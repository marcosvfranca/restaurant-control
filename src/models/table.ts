import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Table {
  _id?: string;
  name: string;
  number: string;
  companyId: string;
  orderId: string;
}

const schema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    name: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
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

interface TableModel extends Omit<Table, '_id'>, Document {}

export const Table: Model<TableModel> = mongoose.model('Table', schema);
