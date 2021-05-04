import path from 'path';
import mime from 'mime';
import fs from 'fs';
import { Response, NextFunction } from 'express';
import { orderModel } from '../order/order.model';
import { IGetUserAuthInfoRequest } from '../auth/auth.restRouter';
const uploadPath = path.join(__dirname, '/../../../../uploads');

interface IImageControler {
  getImage: any;
  getEdittedImage: any;
}

export const imageControler: IImageControler = {
  getImage: () => {},
  getEdittedImage: () => {},
};
imageControler.getImage = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const myOrder = await orderModel.findOne({ orderId: req.params.orderId }).exec();
    if (!myOrder) throw new Error('order not found');
    const img = myOrder.images.find(img => img.name === req.params.imageName);
    if (!img) throw new Error('Image not found');
    const file = path.join(uploadPath, myOrder.orderFolder, img.name + '.' + img.extension);
    res.sendFile(file);
  } catch (e) {
    next(e);
  }
};
imageControler.getEdittedImage = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const myOrder = await orderModel.findOne({ orderId: req.params.orderId }).exec();
    if (!myOrder) throw new Error('order not found');
    const img = myOrder.images.find(img => img.name === req.params.imageName);
    if (!img) throw new Error('Image not found');
    const file = path.join(uploadPath, myOrder.orderFolder, img.name + '-final.' + img.extension);
    res.sendFile(file);
  } catch (e) {
    next(e);
  }
};
