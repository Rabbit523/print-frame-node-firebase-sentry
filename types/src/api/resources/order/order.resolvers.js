"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generalInterfaces_1 = require("../../generalInterfaces");
const lo = __importStar(require("lodash"));
const auth_resolvers_1 = require("../auth/auth.resolvers");
const moment_1 = __importDefault(require("moment"));
const unique_filename_1 = __importDefault(require("unique-filename"));
const authorizenet_1 = require("../../libraries/authorizenet");
const Sentry = __importStar(require("@sentry/node"));
var path = require('path');
const getAllOrderData = async (source, args, { Models: { orderModel } }) => {
    try {
        const total = await orderModel.countDocuments({}, (err, count) => {
            return count;
        });
        const orders = await orderModel.find({}).exec();
        return { total, orders };
    }
    catch (e) {
        Sentry.captureException('OrderData retrieval failed ' + e);
        throw new Error('OrderData retrieval failed ' + e);
    }
    return false;
};
const updateOrder = async (obj, args, { Models: { orderModel } }) => {
    try {
        const order = await orderModel.findById(args.input.id).exec();
        lo.merge(order, args.input);
        await order.save();
        return true;
    }
    catch (e) {
        Sentry.captureException('OrderData retrieval failed ' + e);
        throw new Error('OrderData retrieval failed ' + e);
    }
    return false;
};
const shippingScanner = async (obj, args, { Models: { orderModel } }) => {
    try {
        const result = await orderModel.updateOne({ orderId: args.input.barcode }, { $set: { orderStatus: 'shipped' } });
        if (result.nModified == 0)
            return false;
        else
            return true;
    }
    catch (e) {
        throw new Error('OrderData retrieval failed ' + e);
    }
    return false;
};
const getMyOrders = async (source, {}, { user: awaitedUser, Models: { orderModel } }) => {
    try {
        const user = await awaitedUser;
        const orders = await orderModel.find({ userId: user.uid }).exec();
        return orders;
    }
    catch (e) {
        throw new Error('OrderData retrieval failed ' + e);
    }
};
const updateMyOrderAddress = async (source, { input }, { user: awaitedUser, Models: { orderModel } }) => {
    try {
        const email = input.email;
        const cellPhone = input.cellPhone;
        delete input.email;
        delete input.cellPhone;
        const user = await awaitedUser;
        const oneHour = moment_1.default()
            .subtract(2, 'hours')
            .utc();
        const myOrder = await orderModel
            .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        if (!myOrder)
            throw new Error('order not found');
        myOrder.shippingAddress = input;
        myOrder.billingAddress = input;
        myOrder.phoneNumber = cellPhone;
        myOrder.userEmail = email;
        await myOrder.save();
        return true;
    }
    catch (e) {
        throw new Error('update order failed');
    }
};
const addFrameToMyOrder = async (source, { input }, { user: awaitedUser, Models: { orderModel, productModel } }) => {
    try {
        const user = await awaitedUser;
        const oneHour = moment_1.default()
            .subtract(1, 'hour')
            .utc();
        let myOrder = await orderModel
            .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        const myFrame = await productModel.findById(input.productId).exec();
        if (!myFrame)
            throw new Error('Frame not found');
        const myFrameSize = myFrame.sizes.find(item => item.id === input.sizeId);
        if (!myFrameSize)
            throw new Error('Size not found');
        // console.log('myOrder', myOrder, 'MyFrame', myFrame, 'myFrameSize', myFrameSize);
        if (!myOrder) {
            //The case that client does not have order already
            const randomFolderName = unique_filename_1.default('');
            myOrder = await orderModel.create({
                orderFolder: randomFolderName,
                userId: user.uid,
            });
            if (!myOrder)
                throw new Error('');
            const Frame = {
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
        else {
            const prevFrame = myOrder.frames.find(frame => frame.frameId == myFrame.id + '' && frame.width == myFrameSize.width && frame.height == myFrameSize.height);
            if (prevFrame) {
                await orderModel.findOneAndUpdate({
                    _id: myOrder.id,
                    'frames.frameId': myFrame.id + '',
                    'frames.width': myFrameSize.width,
                    'frames.height': myFrameSize.height,
                }, {
                    $set: {
                        'frames.$.quantity': prevFrame.quantity++,
                    },
                });
                myOrder.orderTotal = myOrder.orderTotal + myFrameSize.price;
                await myOrder.save();
            }
            else {
                const Frame = {
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
                myOrder.orderTotal = myOrder.orderTotal + myFrameSize.price;
                await myOrder.save();
            }
        }
        return true;
    }
    catch (e) {
        console.log(e);
    }
    return false;
};
const getMyOrderItems = async (source, {}, { user: awaitedUser, Models: { orderModel } }) => {
    try {
        const user = await awaitedUser;
        const oneHour = moment_1.default()
            .subtract(2, 'hours')
            .utc();
        await orderModel
            .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        const myOrder = await orderModel
            .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        let res;
        if (!myOrder) {
            res = {
                images: [],
                frames: [],
                total: 0,
                DiscountCode: '',
                shippingPrice: 0,
                DiscountValue: 0,
                discountCodeType: '',
                shippingAddress: '',
                billingAddress: '',
                email: '',
            };
        }
        else {
            res = {
                images: myOrder.images.filter(img => img.finalImageData !== ''),
                frames: myOrder.frames,
                total: myOrder.orderTotal,
                //TODO:Abstract the shipping logic
                shippingPrice: myOrder.orderTotal < 80 ? 15 : 0,
                DiscountCode: myOrder.DiscountCode,
                DiscountValue: myOrder.DiscountCodeValue,
                discountCodeType: myOrder.DiscountCodeType,
                shippingAddress: myOrder.shippingAddress,
                billingAddress: myOrder.billingAddress,
                email: myOrder.userEmail,
            };
        }
        return res;
    }
    catch (e) {
        throw new Error();
    }
};
const submitMyOrder = async (source, { input }, { user: awaitedUser, Models: { orderModel } }) => {
    try {
        const user = await awaitedUser;
        const oneHour = moment_1.default()
            .subtract(2, 'hours')
            .utc();
        const myOrder = await orderModel
            .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        if (!myOrder)
            throw new Error('Order not found');
        const imgItems = myOrder.images.map(img => {
            return {
                id: img.name,
                name: 'Image',
                unitPrice: img.price,
                quantity: img.quantity,
            };
        });
        const frameItems = myOrder.frames.map(frame => {
            return {
                id: frame.frameName,
                name: frame.frameName,
                unitPrice: frame.price,
                quantity: frame.quantity,
            };
        });
        const items = [...frameItems, ...imgItems];
        const paymenObj = {
            token: input.authCode,
            invoiceNumber: '',
            generalProductDescription: '',
            taxAmount: input.tax,
            taxName: 'ca tax',
            taxDescription: 'Sales Tax',
            shippingAmount: input.shippingAmount,
            shippingService: 'FedEX',
            shippingDescription: '',
            billingAddress: myOrder.billingAddress,
            shippingAddress: myOrder.shippingAddress,
            customerMessage: '',
            email: myOrder.userEmail,
            items,
            total: myOrder.orderTotal + input.shippingAmount + input.tax,
        };
        //TODO:Fix the type for this obj
        const paymentResult = await authorizenet_1.createAnAcceptPaymentTransaction(paymenObj);
        if (paymentResult.messages.resultCode === 'Ok') {
            myOrder.authCode = paymentResult.transactionResponse.authCode;
            myOrder.accountNumber = paymentResult.transactionResponse.accountNumber;
            myOrder.transId = paymentResult.transactionResponse.transId;
            myOrder.orderStatue = generalInterfaces_1.orderStatus.pendingShipment;
            await myOrder.save();
            //Do the image processing here
            return true;
        }
        else {
            console.log(JSON.stringify(paymentResult, null, 4));
            return false;
        }
        return true;
    }
    catch (e) {
        throw new Error();
    }
};
exports.orderResolvers = {
    Query: {
        getAllOrderData: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getAllOrderData)),
        getMyOrders: auth_resolvers_1.authenticated(getMyOrders),
        getMyOrderItems: auth_resolvers_1.authenticated(getMyOrderItems),
    },
    Mutation: {
        updateOrder: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, updateOrder)),
        updateMyOrderAddress: auth_resolvers_1.authenticated(updateMyOrderAddress),
        addFrameToMyOrder: auth_resolvers_1.authenticated(addFrameToMyOrder),
        submitMyOrder: auth_resolvers_1.authenticated(submitMyOrder),
        shippingScanner: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, shippingScanner)),
    },
};
//# sourceMappingURL=order.resolvers.js.map