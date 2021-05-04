import { userRoles, orderStatus, IAcceptPaymentConfig } from '../../generalInterfaces';
import * as lo from 'lodash';
import { authorized, authenticated } from '../auth/auth.resolvers';
import uniqueFilename from 'unique-filename';
import { IProduct } from '../product/product.model';
import { createAnAcceptPaymentTransaction } from '../../libraries/authorizenet';
import * as Sentry from '@sentry/node';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { getMyOrder, sendEmailSMS } from '../utils/orderUtils';

const uploadFolder = '/../../../../uploads';

const getOrder = async (source: any,  args: { input: string }, { Models: { orderModel } }) => {
  const id = args.input;
  try {
    const order = await orderModel.findOne({ orderId: id }).exec();
    return order;
  } catch (e) {
    Sentry.captureException('OrderData retrieval failed ' + e);
    throw new Error('OrderData retrieval failed');
  }
};
const getAllOrderData = async (source: any,  args: { input: { offset: number; limit: number } }, { Models: { orderModel } }) => {
  try {
    const total = await orderModel.countDocuments({}).exec();
    const orders = await orderModel
      .find({})
      .skip(args.input.offset)
      .limit(args.input.limit).exec();
    return { total, orders };
  } catch (e) {
    Sentry.captureException('OrderData retrieval failed ' + e);
    throw new Error('OrderData retrieval failed');
  }
};

const updateOrder = async (obj, args, { Models: { orderModel } }) => {
  try {
    const order = await orderModel.findById(args.input.id).exec();
    lo.merge(order, args.input);
    await order.save();
    return true;
  } catch (e) {
    Sentry.captureException('OrderData retrieval failed ' + e);
    throw new Error('OrderData retrieval failed ');
  }
};

const shippingScanner = async (obj, args, { Models: { orderModel } }) => {
  try {
    const result = await orderModel.updateOne({ orderId: args.input.barcode }, { $set: { orderStatus: 'shipped' } });
    if (result.nModified == 0) return false;
    else return true;
  } catch (e) {
    throw new Error('OrderData retrieval failed ');
  }
};

const getMyAddress = async (source: any, {}, { user, Models: { orderModel } }) => {
  try {
    const myOrder = await getMyOrder(user, orderModel);
    const res = {
      shippingAddress: myOrder?myOrder.shippingAddress : "",
      billingAddress: myOrder?myOrder.billingAddress :  "",
      userEmail: myOrder?myOrder.userEmail :  "",
      phoneNumber: myOrder?myOrder.phoneNumber :  "",
      firstName: myOrder?myOrder.firstName :  "",
      lastName: myOrder?myOrder.lastName :  "",
    };
    return res;
  } catch (e) {
    throw new Error('OrderData retrieval failed ' + e);
  }
};

const getMyOrders = async (source: any, {}, { user: awaitedUser, Models: { orderModel } }) => {
  try {
    const user = await awaitedUser;
    const orders = await orderModel.find({ userId: user.uid }).exec();
    return orders;
  } catch (e) {
    throw new Error('OrderData retrieval failed ' + e);
  }
};
const updateMyOrderAddress = async (source: any, { input }, { user, Models: { orderModel } }) => {
  try {
    const myOrder = await getMyOrder(user, orderModel);
    if (!myOrder) throw new Error('order not found');
    myOrder.shippingAddress = input.shippingAddress;
    myOrder.billingAddress = input.billingAddress;
    myOrder.phoneNumber = input.cellPhone;
    myOrder.userEmail = input.email;
    myOrder.firstName = input.firstName;
    myOrder.lastName = input.lastName;
    await myOrder.save();
    return true;
  } catch (e) {
    throw new Error('update order failed');
  }
};
const addFrameToMyOrder = async (
  source: any,
  { input },
  { user: awaitedUser, Models: { orderModel, productModel } },
) => {
  try {
    let myOrder = await getMyOrder(awaitedUser, orderModel);
    const user = await awaitedUser;
    const myFrame: IProduct | undefined = await productModel.findById(input.productId).exec();
    if (!myFrame) throw new Error('Frame not found');
    const myFrameSize = myFrame.sizes.find(item => item.id === input.sizeId);
    if (!myFrameSize) throw new Error('Size not found');

    // console.log('myOrder', myOrder, 'MyFrame', myFrame, 'myFrameSize', myFrameSize);

    if (!myOrder) {
      //The case that client does not have order already
      const randomFolderName = uniqueFilename('');
      myOrder = await orderModel.create({
        orderFolder: randomFolderName,
        userId: user.uid,
      });
      if (!myOrder) throw new Error('');
      const Frame: any = {
        frameId: myFrame.id,
        frameName: myFrame.productName,
        width: myFrameSize.width,
        height: myFrameSize.height,
        price: myFrameSize.price,
        thumbnail: myFrame.Thumbnail,
      };
      myOrder.frames.push(Frame);
      await myOrder.save();
    } else {
      const prevFrame = myOrder.frames.find(
        frame =>
          frame.frameId == myFrame.id + '' && frame.width == myFrameSize.width && frame.height == myFrameSize.height,
      );
      if (prevFrame) {
        await orderModel.findOneAndUpdate(
          {
            _id: myOrder.id,
            'frames.frameId': myFrame.id + '',
            'frames.width': myFrameSize.width,
            'frames.height': myFrameSize.height,
          },
          {
            $set: {
              'frames.$.quantity': prevFrame.quantity++,
            },
          },
        );
        await myOrder.save();
      } else {
        const Frame: any = {
          frameId: myFrame.id,
          frameName: myFrame.productName,
          width: myFrameSize.width,
          height: myFrameSize.height,
          price: myFrameSize.price,
          thumbnail: myFrame.Thumbnail,
          shippingHeight: myFrameSize.shippingHeight,
          shippingWidth: myFrameSize.shippingWidth,
          shippingLength: myFrameSize.shippingLength,
          shippingWeight: myFrameSize.shippingWeight,
        };

        myOrder.frames.push(Frame);
        await myOrder.save();
      }
    }
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};
const getMyOrderItems = async (source: any, {}, { user, Models: { orderModel, optionModel } }) => {
  try {
    const FreeShippingLimit = optionModel.findOne({ optionKey: 'FreeShippingLimit' }).exec();
    // console.log((await FreeShippingLimit).optionValue);
    const myOrder = await getMyOrder(user, orderModel);
    let res;
    if (!myOrder) {
      res = {
        images: [],
        frames: [],
        wallArts: [],
        total: 0,
        DiscountCode: '',
        shippingPrice: 0,
        DiscountValue: 0,
        discountCodeType: '',
        shippingAddress: '',
        billingAddress: '',
        email: '',
      };
    } else {
      let total = 0;
      for (let i = 0; i < myOrder.frames.length; i++) {
        if (myOrder.images[i].finalImageData) total += myOrder.frames[i].price * myOrder.frames[i].quantity;
      }
      for (let j = 0; j < myOrder.images.length; j++) {
        const k = myOrder.images[j].price;
        if (myOrder.images[j].finalImageData) total += k ? k * myOrder.images[j].quantity : 0;
      }
      for (let j = 0; j < myOrder.wallArts.length; j++) {
        if (myOrder.wallArts[j].images[0] && myOrder.wallArts[j].images[0].finalImageData)
          total += myOrder.wallArts[j].price * myOrder.wallArts[j].quantity;
      }
      res = {
        images: myOrder.images.filter(img => img.finalImageData && img.finalImageData !== ''),
        frames: myOrder.frames,
        wallArts: myOrder.wallArts.filter(
          wallArt => wallArt.images[0] && wallArt.images[0].finalImageData && wallArt.images[0].finalImageData !== '',
        ),
        total: total.toFixed(2),
        //TODO:Abstract the shipping logic
        shippingPrice: total < 80 ? 15 : 0,
        DiscountCode: myOrder.DiscountCode,
        DiscountValue: myOrder.DiscountCodeValue,
        discountCodeType: myOrder.DiscountCodeType,
        shippingAddress: myOrder.shippingAddress,
        billingAddress: myOrder.billingAddress,
        email: myOrder.userEmail,
      };
    }
    return res;
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};

const submitMyOrder = async (source: any, { input: { authCode } }, { user, Models: { orderModel } }) => {
  try {
    const myOrder = await getMyOrder(user, orderModel);
    if (!myOrder) throw new Error('Order not found');
    let orderTotal = 0;
    const imgItems: any = [];
    myOrder.images.forEach(img => {
      if (img.finalImageData) {
        orderTotal += img.quantity * (img.price ? img.price : 0);
        imgItems.push({
          id: img.name,
          name: 'Image',
          unitPrice: img.price,
          quantity: img.quantity,
        });
      }
    });
    const frameItems = myOrder.frames.map(frame => {
      orderTotal += frame.price * frame.quantity;
      return {
        id: frame.frameName,
        name: frame.frameName,
        unitPrice: frame.price,
        quantity: frame.quantity,
      };
    });

    const items: any = [...frameItems, ...imgItems];
    const taxAmount = myOrder.shippingAddress.state === 'CA' ? orderTotal * 0.08 : 0;
    const shippingAmount = orderTotal > 80 ? 0 : 15;
    const subtotal = orderTotal;
    orderTotal = orderTotal + taxAmount + (orderTotal > 80 ? 0 : 15);
    if (myOrder.DiscountCode) {
      if (myOrder.DiscountCodeType === 'fix') {
        orderTotal = orderTotal - (myOrder.DiscountCodeValue ? myOrder.DiscountCodeValue : 0);
      } else {
        orderTotal = orderTotal - (myOrder.DiscountCodeValue ? orderTotal * (myOrder.DiscountCodeValue / 100) : 0);
      }
    }
    const paymenObj: IAcceptPaymentConfig = {
      token: authCode,
      invoiceNumber: '',
      generalProductDescription: '',
      taxAmount: +taxAmount.toFixed(2),
      taxName: 'CA Tax',
      taxDescription: 'Sales Tax',
      shippingAmount,
      shippingService: 'FedEX',
      shippingDescription: '',
      billingAddress: myOrder.billingAddress,
      shippingAddress: myOrder.shippingAddress,
      customerMessage: '',
      email: myOrder.userEmail,
      items,
      total: +orderTotal.toFixed(2),
    };
    //TODO:Fix the type for this obj
    // console.log('payment Obj is', paymenObj);
    const paymentResult: any = await createAnAcceptPaymentTransaction(paymenObj);
    // console.log(JSON.stringify(paymentResult, null, 4));
    if (paymentResult.messages.resultCode === 'Ok') {
      myOrder.authCode = paymentResult.transactionResponse.authCode;
      myOrder.accountNumber = paymentResult.transactionResponse.accountNumber;
      myOrder.transId = paymentResult.transactionResponse.transId;
      myOrder.orderStatus = orderStatus.pendingShipment;
      await myOrder.save();
      sendEmailSMS(myOrder.id, subtotal, taxAmount, shippingAmount, orderTotal, orderModel);

      //Do the image processing here

      return true;
    } else {
      console.log(JSON.stringify(paymentResult, null, 4));
      return false;
    }

    return true;
  } catch (e) {
    console.log('Error', e);
    throw new Error();
  }
};

const removeMyOrderItem = async (
  soruce: any,
  { input }: { input: { type: string; id: string } },
  { user, Models: { orderModel } },
) => {
  try {
    const myOrder = await getMyOrder(user, orderModel);
    if (!myOrder) throw new Error('Order not found');

    if (input.type === 'Frame') {
      await orderModel.updateOne({ _id: myOrder.id }, { $pull: { frames: { _id: input.id } } });
    } else {
      const img = myOrder.images.find(img => img.id + '' === input.id);
      img && fs.unlinkSync(path.join(__dirname, uploadFolder, myOrder.orderFolder, img.name + '.' + img.extension));
      await orderModel.updateOne({ _id: myOrder.id }, { $pull: { images: { _id: input.id } } });
    }
    return true;
  } catch (e) {
    console.log(e);
    throw new Error('could not delete the product');
  }
};

const updateMyOrderItemQuantity = async (soruce: any, { input }, { user, Models: { orderModel } }) => {
  try {
    const myOrder = await getMyOrder(user, orderModel);
    if (!myOrder) throw new Error('Order not found');
    if (input.type === 'image')
      await orderModel
        .updateOne({ _id: myOrder.id, 'images._id': input.imageId }, { $set: { 'images.$.quantity': input.quantity } })
        .exec();
    else
      await orderModel
        .updateOne({ _id: myOrder.id, 'frames._id': input.imageId }, { $set: { 'frames.$.quantity': input.quantity } })
        .exec();
    return true;
  } catch (e) {
    throw new Error('could not delete the product');
  }
};
const updateMyWallArtQuantity = async (soruce: any, { input }, { user, Models: { orderModel } }) => {
  try {
    const myOrder = await getMyOrder(user, orderModel);
    if (!myOrder) throw new Error('Order not found');
    await orderModel
      .updateOne(
        { _id: myOrder.id, 'wallArts._id': input.wallArtId },
        { $set: { 'wallArts.$.quantity': input.quantity } },
      )
      .exec();
    return true;
  } catch (e) {
    throw new Error('could not delete the product');
  }
};
const addWallArt = async (source: any, { input }, { user, Models: { orderModel } }) => {
  try {
    let resolvedUser = await user;
    const oneHour = moment()
      .subtract(2, 'hours')
      .utc();
    let userOrder = await orderModel
      .findOne({ userId: resolvedUser.uid, orderStatus: orderStatus.started, updatedAt: { $gt: oneHour } })
      .exec();
    if (!userOrder) {
      const randomFolderName = uniqueFilename('');
      userOrder = await orderModel.create({
        orderFolder: randomFolderName,
        userId: resolvedUser.uid,
      });
    }
    const wallArtData = {
      name: input.name,
      price: input.price,
      image: [],
    };
    userOrder.wallArts.push(wallArtData);
    const ImageData = {
      width: 0,
      height: 0,
      imageData: '',
      quantity: 1,
      isBlackAndWhite: false,
      name: 'temp',
      extension: 'temp',
    };
    let count = 0;
    if (input.name == 'Family') count = 5;
    else if (input.name == 'Trio') count = 3;
    else if (input.name == 'Capture Four') count = 4;
    for (let i = 0; i < count; i++) userOrder.wallArts[userOrder.wallArts.length - 1].images.push(ImageData);
    await userOrder.save();
    const res = {
      id: userOrder.wallArts[userOrder.wallArts.length - 1]._id,
    };
    return res;
  } catch (e) {
    return false;
  }
};
export const orderResolvers = {
  Query: {
    getAllOrderData: authenticated(authorized(userRoles.admin, getAllOrderData)),
    getMyOrders: authenticated(getMyOrders),
    getMyOrderItems: authenticated(getMyOrderItems),
    getMyAddress: authenticated(getMyAddress),
    getOrder: authenticated(getOrder),
  },
  Mutation: {
    updateOrder: authenticated(authorized(userRoles.admin, updateOrder)),
    updateMyOrderAddress: authenticated(updateMyOrderAddress),
    addFrameToMyOrder: authenticated(addFrameToMyOrder),
    submitMyOrder: authenticated(submitMyOrder),
    removeMyOrderItem: authenticated(removeMyOrderItem),
    updateMyOrderItemQuantity: authenticated(updateMyOrderItemQuantity),
    updateMyWallArtQuantity: authenticated(updateMyWallArtQuantity),
    shippingScanner: authenticated(authorized(userRoles.admin, shippingScanner)),
    addWallArt: authenticated(addWallArt),
  },
};
