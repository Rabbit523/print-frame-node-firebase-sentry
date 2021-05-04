import { createWriteStream, unlink } from 'fs';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import uniqueFilename from 'unique-filename';
import sharp from 'sharp';
import moment from 'moment';
import * as Sentry from '@sentry/node';
import axios from 'axios';
import { getMyOrder } from '../utils/orderUtils';
import { IProduct, IProductSize } from '../product/product.model';
import { WriteFileToDisk, getPrintSizes } from '../utils/imageUtils';
const sizeOf = promisify(require('image-size'));

const cloudinaryUrl = 'https://res.cloudinary.com/dpvymgk1m/image/upload/';
const uploadFolder = '/../../../../uploads';

import { orderStatus } from '../../generalInterfaces';
import { authenticated } from '../auth/auth.resolvers';
import { OrderImage, IOrder, IWallArt } from '../order/order.model';

const uploadPath = path.join(__dirname, uploadFolder);

/**
 * This is the main function for uploading images
 * It accepts images one by one
 * 1- Is to get user information either anonymous or with name
 * 2- if the user does not have any orders then create a new one for him/her
 * 3- if the user has order and it is older than one hour then create a new order
 * 4- if order exists then get the folder name for the order and upload the picture there
 * 5- After upload get the printable sizes and color and black and white version and return it
 * @param source
 * @param param1
 * @param param2
 */
const singleImageFileUpload = async (
  source: any,
  { input: file },
  { user, Models: { orderModel, optionModel, printSizeModel } },
) => {
  try {
    let resolvedUser = await user;
    //Preparing the file for upload
    const { createReadStream, filename } = await file;
    const extension = filename.split('.').pop();

    if (!['jpeg', 'gif', 'png', 'jpg'].includes(extension.toLowerCase())) {
      throw new Error('Image extension not supported');
    }
    // This is the case that the given user does not have any
    // orders before (It mostly happens in anonymous singIns)

    let myOrder = await getMyOrder(user, orderModel);
    const randomFileName = uniqueFilename('');
    const fullFileName = randomFileName + '.' + extension;
    let filePath;
    if (!myOrder) {
      const randomFolderName = uniqueFilename('');
      fs.mkdirSync(path.join(uploadPath, randomFolderName));
      filePath = path.join(uploadPath, randomFolderName, fullFileName);
      myOrder = await orderModel.create({
        orderFolder: randomFolderName,
        userId: resolvedUser.uid,
      });
    } else {
      filePath = path.join(uploadPath, myOrder.orderFolder, fullFileName);
    }

    if (!myOrder) throw new Error('Order Creation failed');
    const folderPath = path.join(uploadPath, myOrder.orderFolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    let { optionValue: maxLength } = await optionModel.findOne({ optionKey: 'MaxImageSize' }).exec();
    try {
      //MaxImageSize by MB
      maxLength = parseInt(maxLength) * 1000000;
      await WriteFileToDisk(createReadStream, maxLength, filePath);
      const imgSize = await sharp(filePath).metadata();
      const img = await sharp(filePath.toString())
        .resize(600, 400, { fit: 'outside' })
        .jpeg({ quality: 100 })
        .toBuffer();
      const ImageData = {
        width: imgSize.width as number,
        height: imgSize.height as number,
        imageData: img.toString('base64'),
        quantity: 1,
        isBlackAndWhite: false,
        name: randomFileName,
        extension,
      };
      myOrder.images.push(ImageData as any);
      await myOrder.save();
      const res = {
        name: randomFileName,
      };
      return res;
    } catch (e) {
      Sentry.captureException('Back end did not setup properly');
    }
  } catch (e) {
    Sentry.captureException('Image upload problem' + e);
    console.log('single image upload ', e);
    throw new Error(e);
  }
  return false;
};
const wallArtImageFileUpload = async (
  source: any,
  { input },
  { user, Models: { orderModel, optionModel, printSizeModel } },
) => {
  try {
    let resolvedUser = await user;
    //Preparing the file for upload
    const { createReadStream, filename } = await input.file;
    const extension = filename.split('.').pop();
    if (!['jpeg', 'gif', 'png', 'jpg'].includes(extension.toLowerCase())) {
      Sentry.captureException('Image extension not supported');
    }
    // This is the case that the given user does not have any
    // orders before (It mostly happens in anonymous singIns)
    const oneHour = moment()
      .subtract(2, 'hours')
      .utc();
    let userOrder = await orderModel
      .findOne({ userId: resolvedUser.uid, orderStatus: orderStatus.started, updatedAt: { $gt: oneHour } })
      .exec();
    const randomFileName = uniqueFilename('');
    const fullFileName = randomFileName + '.' + extension;
    let filePath;
    if (!userOrder) {
      return false;
    } else {
      filePath = path.join(uploadPath, userOrder.orderFolder, fullFileName);
    }

    const folderPath = path.join(uploadPath, userOrder.orderFolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    let { optionValue: maxLength } = await optionModel.findOne({ optionKey: 'MaxImageSize' }).exec();
    try {
      //MaxImageSize by MB
      maxLength = parseInt(maxLength) * 1000000;
      await WriteFileToDisk(createReadStream, maxLength, filePath);
      const imgSize = await sizeOf(filePath);

      const img = await sharp(filePath.toString())
        .resize(400, 200, { fit: 'outside' })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      const ImageData = {
        width: imgSize.width as number,
        height: imgSize.height as number,
        imageData: img.toString('base64'),
        quantity: 1,
        isBlackAndWhite: false,
        name: randomFileName,
        extension,
      };
      const wallArt= userOrder.wallArts.find(wallArts => wallArts.id === input.wallArtId);
      wallArt.images[input.imageNo] =ImageData;
      await userOrder.save();
      const currentImage = wallArt.images[input.imageNo];
      const { optionValue: printDpi } = await optionModel.findOne({ optionKey: 'DPI' }).exec();
      const printSizes = await getPrintSizes({ width: currentImage.width, height: currentImage.height }, printDpi, printSizeModel);
      const imgBuffer = Buffer.from(currentImage.imageData, 'base64');
      const grayscale = await sharp(imgBuffer)
        .grayscale()
        .jpeg({ quality: 100 })
        .toBuffer();
      return {
        name: currentImage.name,
        filename: randomFileName,
        base64: 'data:img/jpeg;base64, ' + currentImage.imageData,
        base64GrayScale: 'data:img/jpeg;base64, ' + grayscale.toString('base64'),
        frameName: "",
        printSizes,
      };
    } catch (e) {
      Sentry.captureException('Back end did not setup properly');
    }
  } catch (e) {
    Sentry.captureException('Image upload problem' + e);
    Sentry.captureException('There was an error uploading image');
    throw new Error(e);
  }
  return false;
};
const getAllMyImages = async (source: any, {}, { user: awaitedUser, Models: { orderModel } }) => {
  const myOrder = await getMyOrder(awaitedUser, orderModel, true);
  if (!myOrder) throw new Error('Order not found');
  const res = myOrder.images.map(img => {
    return {
      name: img.name,
      base64: img.imageData,
    };
  });
  return res;
};
const getWallArt = async (
  source: any,
  { input },
  { user: awaitedUser, Models: { orderModel, printSizeModel, optionModel } },
) => {
  const myOrder = await getMyOrder(awaitedUser, orderModel, true);
  if (!myOrder) throw new Error('order not found');
  const wallArt: IWallArt | undefined = myOrder.wallArts.find(wallArt => wallArt.id === input.id) || undefined;
  return wallArt;
};
const getMyWallArtImage = async (
  source: any,
  { input },
  { user: awaitedUser, Models: { orderModel, printSizeModel, optionModel } },
) => {
  const myOrder = await getMyOrder(awaitedUser, orderModel, true);
  if (!myOrder) throw new Error('order not found');
  const wallArt: IWallArt | undefined = myOrder.wallArts.find(wallArt => wallArt.id === input.wallArtId) || undefined;
  const img: OrderImage | undefined = wallArt
    ? wallArt.images.find(img => img.name === input.filename) || undefined
    : undefined;
  if (!img) throw new Error('Image not found');
  const { optionValue: printDpi } = await optionModel.findOne({ optionKey: 'DPI' }).exec();
  const printSizes = await getPrintSizes({ width: img.width, height: img.height }, printDpi, printSizeModel);
  const imgBuffer = Buffer.from(img.imageData, 'base64');
  const grayscale = await sharp(imgBuffer)
    .grayscale()
    .jpeg({ quality: 100 })
    .toBuffer();

  return {
    name: img.name,
    base64: 'data:img/jpeg;base64, ' + img.imageData,
    base64GrayScale: 'data:img/jpeg;base64, ' + grayscale.toString('base64'),
    frameName: img.frameName,
    printSizes,
  };
};
const getMyImage = async (
  source: any,
  { input }: { input: string },
  { user, Models: { orderModel, printSizeModel, optionModel } },
) => {
  try {
    const myOrder = await getMyOrder(user, orderModel, true);
    if (!myOrder) throw new Error('order not found');
    const img: OrderImage | undefined = myOrder.images.find(img => img.name === input);
    if (!img) throw new Error('Image not found');
    const { optionValue: printDpi } = await optionModel.findOne({ optionKey: 'DPI' }).exec();
    const printSizes = await getPrintSizes({ width: img.width, height: img.height }, printDpi, printSizeModel);
    const imgBuffer = Buffer.from(img.imageData, 'base64');
    const grayscale = await sharp(imgBuffer)
      .grayscale()
      .jpeg({ quality: 100 })
      .toBuffer();

    const res = {
      name: img.name,
      base64: 'data:img/jpeg;base64, ' + img.imageData,
      base64GrayScale: 'data:img/jpeg;base64, ' + grayscale.toString('base64'),
      frameName: img.frameName,
      printWidth: img.printWidth,
      printHeight: img.printHeight,
      isBlackAndWhite: img.isBlackAndWhite,
      printSizes,
    };
    return res;
  } catch (e) {
    console.log('single image return fail', e);
    throw new Error();
  }
};

const updateMyOrderImage = async (
  source: any,
  { input },
  { user, Models: { orderModel, productModel, printSizeModel } },
) => {
  try {
    const myOrder = await getMyOrder(user, orderModel, true);
    if (!myOrder) throw new Error('Order not found');
    const img: OrderImage | undefined = myOrder.images.find(img => img.name === input.name);
    if (!img) throw new Error('Image not found');
    const selectedPrintSize = await printSizeModel.findById(input.selectedSize).exec();
    if (!selectedPrintSize) throw new Error('selected size is not valid');
    let finalImage;
    let price;
    let frameName = '';
    if (input.type === 'FRAMED_IMAGE') {
      //This is image and Frame
      price = selectedPrintSize.framePrice;
      const selectedFrame = await productModel.findById(input.selectedFrame).exec();
      if (!selectedFrame) throw new Error('No frame found');
      const selectedSizeMargin: IProductSize | undefined = selectedFrame.sizes.find(
        size => size.width === input.width && size.height === input.height,
      );
      if (!selectedSizeMargin) throw new Error('print size not found');
      frameName = selectedFrame.productName;
      const imgBuffer = Buffer.from(input.scaledImage.split('data:image/png;base64,')[1], 'base64');
      const imgSize = await sharp(imgBuffer).metadata();
      const url = cloudinaryUrl + selectedFrame.FramedImageThumbnail;

      const FrameBuffer = (
        await axios({
          url,
          responseType: 'arraybuffer',
        })
      ).data as Buffer;
      //8 is the minimum on the screen
      finalImage = await sharp(FrameBuffer)
        .resize(
          imgSize.width + Math.ceil(selectedSizeMargin.serverWidthMargin * (input.frameFactor / 8)),
          // imgSize.height + selectedSizeMargin.height,
          imgSize.height + 170,
          {
            fit: 'fill',
          },
        )
        .composite([{ input: imgBuffer, blend: 'saturate' }])
        .jpeg({ quality: 100 })
        .toBuffer();
      // .toFile(path.join(__dirname, uploadFolder, img.name + '-finalclear'));
    } else {
      //This is print only
      finalImage = input.scaledImage.split('data:image/png;base64,')[1];
      price = selectedPrintSize.price;
    }

    await orderModel.findOneAndUpdate(
      { _id: myOrder.id, 'images._id': img.id },
      {
        $set: {
          'images.$.finalImageData': finalImage.toString('base64'),
          'images.$.price': price,
          'images.$.quantity': input.quantity,
          'images.$.isBlackAndWhite': input.isColor === 'full-color' ? false : true,
          'images.$.EditX': input.sizeInfo.x,
          'images.$.EditY': input.sizeInfo.y,
          'images.$.EditWidth': input.sizeInfo.width,
          'images.$.EditHeight': input.sizeInfo.height,
          'images.$.printWidth': selectedPrintSize.width,
          'images.$.printHeight': selectedPrintSize.height,
          'images.$.frameName': frameName,
        },
      },
    );

    await myOrder.save();

    return true;
  } catch (e) {
    console.log('something is wrong\n', e);
  }
  return false;
};
const removeWallArt = async (
  source: any,
  { input },
  { user: awaitedUser, Models: { orderModel, productModel, printSizeModel } },
) => {
  try {
    const myOrder = await getMyOrder(awaitedUser, orderModel, true);
    if (!myOrder) throw new Error('Order not found');

    await orderModel.updateOne({ _id: myOrder.id }, { $pull: { wallArts: { _id: input.id } } });
    return true;
  } catch (e) {
    console.log(e);
    throw new Error('could not delete the product');
  }
};
const updateMyWallArtImage = async (
  source: any,
  { input },
  { user: awaitedUser, Models: { orderModel, productModel, printSizeModel } },
) => {
  try {
    const myOrder = await getMyOrder(awaitedUser, orderModel, true);
    if (!myOrder) throw new Error('order not found');
    const wallArt: IWallArt | undefined = myOrder.wallArts.find(wallArt => wallArt.id === input.wallArtId) || undefined;
    const img: OrderImage | undefined = wallArt
      ? wallArt.images.find(img => img.name === input.filename) || undefined
      : undefined;
    if (!img) throw new Error('Image not found');
    const selectedPrintSize = await printSizeModel.findById(input.data.selectedSize).exec();
    if (!selectedPrintSize) throw new Error('selected size is not valid');
    let finalImage;
    let price;
    let frameName = '';
    if (input.data.type === 'FRAMED_IMAGE') {
      //This is image and Frame
      price = selectedPrintSize.framePrice;
      const selectedFrame = await productModel.findById(input.data.selectedFrame).exec();
      if (!selectedFrame) throw new Error('No frame found');
      frameName = selectedFrame.productName;
      const FrameBuffer = (
        await axios({
          url: cloudinaryUrl + selectedFrame.FramedImageThumbnail,
          responseType: 'arraybuffer',
        })
      ).data as Buffer;
      const imgBuffer = Buffer.from(input.data.scaledImage.split('data:image/png;base64,')[1], 'base64');
      const imgSize = await sharp(imgBuffer).metadata();
      finalImage = await sharp(FrameBuffer)
        .resize(imgSize.width + 160, imgSize.height + 160, { fit: 'fill' })
        .composite([{ input: imgBuffer, blend: 'saturate' }])
        .jpeg({ quality: 100 })
        .toBuffer();
      // .oFile(path.join(__dirname, uploadFolder, myOrder.orderFolder, img.name + '-finalclear'));
    } else {
      //This is print only
      finalImage = input.data.scaledImage.split('data:image/png;base64,')[1];
      price = selectedPrintSize.price;
    }
    img.finalImageData = finalImage.toString('base64');
    img.price = price;
    img.quantity = input.data.quantity;
    img.isBlackAndWhite = input.data.isColor === 'full-color' ? false : true;
    img.EditX = input.data.sizeInfo.x;
    img.EditY = input.data.sizeInfo.y;
    img.EditWidth = input.data.sizeInfo.width;
    img.EditHeight = input.data.sizeInfo.height;
    img.printWidth = selectedPrintSize.width;
    img.printHeight = selectedPrintSize.height;
    img.frameName = frameName;

    await myOrder.save();

    return true;
  } catch (e) {
    console.log('something is wrong\n', e);
  }
  return false;
};
export const imageResolvers = {
  Query: {
    getAllMyImages: authenticated(getAllMyImages),
    getMyImage: authenticated(getMyImage),
    getMyWallArtImage: authenticated(getMyWallArtImage),
    getWallArt: authenticated(getWallArt),
  },
  Mutation: {
    singleImageFileUpload: authenticated(singleImageFileUpload),
    wallArtImageFileUpload: authenticated(wallArtImageFileUpload),
    updateMyOrderImage: authenticated(updateMyOrderImage),
    updateMyWallArtImage: authenticated(updateMyWallArtImage),
    removeWallArt: authenticated(removeWallArt),
  },
};
