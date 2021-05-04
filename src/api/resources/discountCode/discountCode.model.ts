import { Schema, Document, Model, model } from 'mongoose';
import moment from 'moment';

export enum fixOrPercent {
  fix = 'fix',
  percent = 'percent',
}

export enum discountStatus {
  expired = 'expired',
  active = 'active',
  disabled = 'disabled',
}

export interface IDiscountCode extends Document {
  code: string;
  expirationDate?: Date;
  startDate?: Date;
  value: number;
  type: fixOrPercent;
  limit?: number;
  timesUsed?: number;
  status: discountStatus;
}

const discountCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    expirationDate: {
      type: Date,
    },
    startDate: {
      type: Date
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      enum: ['fix', 'percent'],
    },
    status: {
      type: String,
      enum: ['expired', 'active', 'disabled'],
      default: 'active',
    },
    limit: Number,
    timesUsed: Number,
  },
  { timestamps: true },
);

discountCodeSchema.pre<IDiscountCode>('save', function(next) {
  if (this.value > 100 && this.type === 'percent') {
    next(new Error('percent value cannot be more than 100'));
  } else if (this.expirationDate && moment(this.expirationDate).isBefore(moment())) {
    next(new Error('Expiration date cannot be in past'));
  } else {
    next();
  }
});

export const discountCodeModel: Model<IDiscountCode> = model<IDiscountCode>('discountCode', discountCodeSchema);
