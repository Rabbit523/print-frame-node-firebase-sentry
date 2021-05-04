import { Schema, Document, model, Model } from 'mongoose';
import { IAddress, statesArray } from '../../generalInterfaces';

export interface IUser extends Document {
  userEmail: string;
  salutation?: string;
  firstName: string;
  lastName: string;
  userRole: string;
  userUid: string;
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
}
const userSchema: Schema = new Schema(
  {
    userEmail: {
      type: String,
      unique: true,
    },
    salutation: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    userUid: {
      type: String,
      required: true,
    },
    shippingAddress: {
      name: String,
      street1: String,
      street2: String,
      city: String,
      zipCode: Number,
      country: String,
      state: {
        type: String,
        enum: statesArray,
      },
    },
    billingAddress: {
      name: String,
      street1: String,
      street2: String,
      city: String,
      zipCode: Number,
      country: String,
      state: {
        type: String,
        enum: statesArray,
      },
    },
  },
  { timestamps: true },
);

export const userModel: Model<IUser> = model<IUser>('user', userSchema);
