import { Schema, Document, Model, model } from 'mongoose';

export interface IPrintSize extends Document {
  width: Number;
  height: Number;
  price: Number;
  framePrice: Number;
  hasFrame: boolean;
  margin: Number;
  frameMargin: Number;
  shippingWidth: Number;
  shippingLength: Number;
  shippingHeight: Number;
  shippingWeight: Number;
}

const printSizeSchema = new Schema(
  {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    framePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    hasFrame: {
      type: Boolean,
      required: true,
      default: false,
    },
    margin: {
      type: Number,
      required: true,
      default: 0,
    },
    frameMargin: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingHeight: {
      type: Number,
      required: true,
    },
    shippingLength: {
      type: Number,
      required: true,
    },
    shippingWidth: {
      type: Number,
      required: true,
    },
    shippingWeight: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
printSizeSchema.index({ width: 1, height: 1, disabled: 1 }, { unique: true });
export const printSizeModel: Model<IPrintSize> = model<IPrintSize>('printSize', printSizeSchema);
