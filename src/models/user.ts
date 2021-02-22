import mongoose, { Document, Model } from 'mongoose';
import AuthService from '@src/services/auth';
import { CUSTOM_VALIDATION } from '@src/models/index';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
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

interface UserModel extends Omit<User, '_id'>, Document {}

/**
 * Validates the email and throws a validation errors, otherwise it will throw a 500
 */
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

/**
 * Validates the email and throws a validation errors, otherwise it will throw a 500
 */
schema.path('email').validate(
  async (email: string) => {
    const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  },
  'is invalid value.',
  CUSTOM_VALIDATION.INVALID_EMAIL
);

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    console.error(`Error hashing the password for the user ${this.name}`, err);
  }
});

export const User: Model<UserModel> = mongoose.model('User', schema);
