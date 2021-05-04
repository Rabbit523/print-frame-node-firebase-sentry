import { Schema, Document, Model, model } from 'mongoose';

export interface IProduct extends Document {
  productName: string;
  productSku: string;
  productDescription?: string;
  productPrice: number;
  productQuantity?: number;
  Thumbnail: string;
  FramedImageThumbnail: string;
  FrameImageBorderWidth: number;
  FrameBorderWidth: number;
  FrameImageOutset: number;
  sizes: IProductSize[];
  images: IProductImage[];
}
export interface IProductImage extends Document {
  imageUrl: string;
}
export interface IProductSize extends Document {
  width: number;
  height: number;
  price: number;
  shippingWidth: number;
  shippingHeight: number;
  shippingLength: number;
  shippingWeight: number;
  quantity?: number;
  serverHeightMargin: number;
  serverWidthMargin: number;
}
const productSizeSchema = new Schema({
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
  shippingWidth: {
    type: Number,
    required: true,
  },
  shippingHeight: {
    type: Number,
    required: true,
  },
  shippingLength: {
    type: Number,
    required: true,
  },
  shippingWeight: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
  },
  serverHeightMargin: {
    type: Number,
    required: true,
    default: 0,
  },
  serverWidthMargin: {
    type: Number,
    required: true,
    default: 0,
  },
});

const productImageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});
const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, 'product name  is necessary'],
    },
    uri: {
      type: String,
      required: [true, 'product uri  is necessary'],
      unique: true,
    },
    productSku: {
      type: String,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
    },
    productPrice: {
      type: Number,
    },
    productQuantity: {
      type: Number,
    },
    Thumbnail: {
      type: String,
      required: true,
    },
    FramedImageThumbnail: {
      type: String,
      required: true,
    },

    FrameImageBorderWidth: {
      type: Number,
      required: true,
      default: 0,
    },
    FrameBorderWidth: {
      type: Number,
      required: true,
      default: 0,
    },
    FrameImageOutset: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [productImageSchema],
    sizes: [productSizeSchema],
  },

  { timestamps: true },
);
productSchema.index({ 'sizes.width': 1, 'sizes.height': 1, productSku: 1 }, { unique: true });
export const productModel: Model<IProduct> = model<IProduct>('product', productSchema);
