import moment from 'moment';
import { IOrder } from '../order/order.model';
import { orderStatus } from '../../generalInterfaces';
import { newOrderCreatedClient, newOrderCreatedAdmin } from '../../libraries/sendGrid';
import { cropImage } from '../../libraries/imageEditor';
import { newOrder } from '../../libraries/twilio';
import { makePdf } from '../../libraries/pdfGenerator';

export const getMyOrder = async (user, orderModel, withRawImages = false): Promise<IOrder | null> => {
  const resolvedUser = await user;
  const oneHour = moment()
    .subtract(2, 'hours')
    .utc();
  const order = await orderModel
    .findOne({
      userId: resolvedUser.uid,
      orderStatus: orderStatus.started,
      updatedAt: { $gt: oneHour },
    })
    .exec();
  if (!order || withRawImages) return order;
  //This is for the case that they upload image but do not edit it
  const FinalImages = order.images.filter(img => img.finalImageData !== undefined);
  order.images = FinalImages;
  return order;
};

export const sendEmailSMS = async (orderId, subtotal, taxAmount, shippingAmount, orderTotal, orderModel) => {
  try {
    const myOrder = await orderModel.findById(orderId).exec();
    if (!myOrder) throw new Error('order Not found');
    const pdfData = await makePdf(
      myOrder,
      subtotal,
      taxAmount,
      shippingAmount,
      myOrder.DiscountCodeValue ? myOrder.DiscountCodeValue : 0,
      +orderTotal.toFixed(2),
    );

    const emailConfigClient = {
      firstName: myOrder.firstName as string,
      userEmail: myOrder.userEmail,
      invoiceUrl: pdfData.invoice as string,
      orderId: myOrder.orderId + '',
    };

    const emailConfigAdmin = {
      firstName: myOrder.firstName as string,
      userEmail: myOrder.userEmail,
      orderId: myOrder.orderId + '',
      invoiceUrl: pdfData.invoice as string,
      ImageList: pdfData.imageList as string,
    };
    newOrderCreatedClient(emailConfigClient);
    newOrderCreatedAdmin(emailConfigAdmin);
    myOrder.phoneNumber && newOrder(myOrder.orderId + '', +myOrder.phoneNumber);
    myOrder.images.forEach(img => {
      cropImage({
        imgName: img.name,
        imgExtension: img.extension,
        imgWidth: img.width,
        imgHeight: img.height,
        EditX: img.EditX,
        EditY: img.EditY,
        EditWidth: img.EditWidth,
        EditHeight: img.EditHeight,
        isGrayScale: img.isBlackAndWite,
        orderFolder: myOrder.orderFolder,
      });
    });
  } catch (e) {
    console.log('send sms Error', e);
    throw new Error(e);
  }
};
