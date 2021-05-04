import { Schema, Document, Model, model } from 'mongoose';
import { statesArray, IAddress, orderStatus } from '../../generalInterfaces';
import { fixOrPercent } from '../discountCode/discountCode.model';

export interface OrderImage extends Document {
  width: number;
  height: number;
  imageData: string;
  finalImageData: string;
  price?: number;
  quantity: number;
  isBlackAndWhite: boolean;
  name: string;
  extension: string;
  EditX?: number;
  EditY?: number;
  EditWidth?: number;
  EditHeight?: number;
  printWidth?: number;
  printHeight?: number;
  frameName?: string;
}

export interface OrderFrame extends Document {
  frameId: string;
  frameName: string;
  thumbnail: string;
  width: number;
  height: number;
  price: number;
  quantity: number;
}
export interface IWallArt extends Document {
  name: string;
  price: number;
  quantity: number;
  images: [OrderImage];
}

export interface IOrder extends Document {
  userID: string;
  firstName?: string;
  lastName?: string;
  userEmail: string;
  phoneNumber: String;
  notes: String;
  salutation: string;
  paymentDate: Date;
  shipmentDate: Date;
  orderStatus: orderStatus;
  billingAddress: IAddress;
  shippingAddress: IAddress;
  orderTotal: number;
  DiscountCode?: string;
  DiscountCodeValue?: number;
  DiscountCodeType?: fixOrPercent;
  tax: number;
  orderFolder: string;
  orderId: number;
  images: [OrderImage];
  frames: [OrderFrame];
  wallArts: [IWallArt];
  authCode?: string;
  accountNumber?: string;
  transId?: string;
}
const orderImageSchema = new Schema(
  {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    imageData: {
      type: String,
    },
    finalImageData: String,
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isBlackAndWhite: {
      type: Boolean,
      required: true,
      default: false,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    name: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    EditX: Number,
    EditY: Number,
    EditWidth: Number,
    EditHeight: Number,
    printWidth: Number,
    printHeight: Number,
    frameName: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const orderFrameSchema = new Schema(
  {
    frameName: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    frameId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true },
);

const wallArtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [orderImageSchema],
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true },
);
const orderSchema = new Schema(
  {
    paymentDate: {
      type: Date,
    },
    shipmentDate: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ['started', 'cancelled', 'refunded', 'paymentFailed', 'pendingShipment', 'shipped'],
      default: 'started',
    },
    orderFolder: {
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
    orderTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
    salutation: {
      type: String,
    },
    orderId: {
      type: String,
      unique: true,
    },
    DiscountCode: {
      type: String,
      default: '',
    },
    DiscountCodeValue: {
      type: String,
      default: '',
    },
    DiscountCodeType: {
      type: String,
      default: '',
    },
    images: [orderImageSchema],
    frames: [orderFrameSchema],
    wallArts: [wallArtSchema],
    shippingLabel: [],
    authCode: String,
    accountNumber: String,
    transId: String,
  },
  { timestamps: true },
);

orderSchema.pre('save', function(next) {
  if ((this as IOrder).orderId) {
    return next();
  }
  (this as IOrder).orderId = Math.floor(Math.random() * 10000000000000000);
  next();
});

export const orderModel: Model<IOrder> = model<IOrder>('order', orderSchema);
