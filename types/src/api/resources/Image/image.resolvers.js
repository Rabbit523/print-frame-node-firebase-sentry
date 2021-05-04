"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs_2 = __importDefault(require("fs"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const unique_filename_1 = __importDefault(require("unique-filename"));
const sharp_1 = __importDefault(require("sharp"));
const moment_1 = __importDefault(require("moment"));
const Sentry = __importStar(require("@sentry/node"));
const axios_1 = __importDefault(require("axios"));
const sizeOf = util_1.promisify(require('image-size'));
const cloudinaryUrl = 'https://res.cloudinary.com/dpvymgk1m/image/upload/';
const uploadFolder = '/../../../../uploads';
const generalInterfaces_1 = require("../../generalInterfaces");
const auth_resolvers_1 = require("../auth/auth.resolvers");
const uploadPath = path_1.default.join(__dirname, uploadFolder);
const WriteFileToDisk = async (createReadStream, maxLength, filePath) => {
    let dataLength = 0;
    try {
        await new Promise((resolve, reject) => createReadStream()
            .on('data', function (chunk) {
            dataLength += chunk.length;
            if (dataLength > maxLength) {
                reject('File size too big');
                return new Error('File size too big');
            }
            return true;
        })
            .pipe(fs_1.createWriteStream(filePath))
            .on('close', () => {
            resolve(filePath);
        })
            .on('error', err => {
            Sentry.captureException(err);
            reject(err);
        }));
    }
    catch (e) {
        if (e === 'File size too big') {
            fs_1.unlink(filePath, err => {
                Sentry.captureException('File could not be deleted' + err);
            });
            Sentry.captureException(e);
        }
    }
};
const getPrintSizes = async (imgSize, printDpi, printSizeModel) => {
    try {
        const dpi = Math.ceil((imgSize.height * imgSize.width) / (printDpi * printDpi));
        let printSizes = await printSizeModel
            .aggregate([
            {
                $project: {
                    id: 1,
                    width: 1,
                    height: 1,
                    price: 1,
                    shippingWidth: 1,
                    shippingHeight: 1,
                    shippingLength: 1,
                    shippingWeight: 1,
                    framePrice: 1,
                    hasFrame: 1,
                    total: { $multiply: ['$width', '$height'] },
                },
            },
            { $match: { total: { $lt: dpi } } },
        ])
            .exec();
        printSizes = printSizes.map(item => {
            item.id = item._id;
            return item;
        });
        return printSizes;
    }
    catch (e) {
        Sentry.captureException('print size problem' + e);
    }
};
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
const singleImageFileUpload = async (source, { input: file }, { user, Models: { orderModel, optionModel, printSizeModel } }) => {
    try {
        let resolvedUser = await user;
        //Preparing the file for upload
        const { createReadStream, filename } = await file;
        const extension = filename.split('.').pop();
        if (!['jpeg', 'gif', 'png', 'jpg'].includes(extension.toLowerCase())) {
            Sentry.captureException('Image extension not supported');
        }
        // This is the case that the given user does not have any
        // orders before (It mostly happens in anonymous singIns)
        const oneHour = moment_1.default()
            .subtract(2, 'hours')
            .utc();
        let userOrder = await orderModel
            .findOne({ userId: resolvedUser.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        const randomFileName = unique_filename_1.default('');
        const fullFileName = randomFileName + '.' + extension;
        let filePath;
        if (!userOrder) {
            const randomFolderName = unique_filename_1.default('');
            fs_2.default.mkdirSync(path_1.default.join(uploadPath, randomFolderName));
            filePath = path_1.default.join(uploadPath, randomFolderName, fullFileName);
            userOrder = await orderModel.create({
                orderFolder: randomFolderName,
                userId: resolvedUser.uid,
            });
        }
        else {
            filePath = path_1.default.join(uploadPath, userOrder.orderFolder, fullFileName);
        }
        const folderPath = path_1.default.join(uploadPath, userOrder.orderFolder);
        if (!fs_2.default.existsSync(folderPath)) {
            fs_2.default.mkdirSync(folderPath);
        }
        let { optionValue: maxLength } = await optionModel.findOne({ optionKey: 'MaxImageSize' }).exec();
        try {
            //MaxImageSize by MB
            maxLength = parseInt(maxLength) * 1000000;
            await WriteFileToDisk(createReadStream, maxLength, filePath);
            const imgSize = await sizeOf(filePath);
            const img = await sharp_1.default(filePath.toString())
                .resize(400, 200, { fit: 'outside' })
                .jpeg({ quality: 80, progressive: true })
                .toBuffer();
            const ImageData = {
                width: imgSize.width,
                height: imgSize.height,
                imageData: img.toString('base64'),
                quantity: 1,
                isBlackAndWite: false,
                name: randomFileName,
                extension,
            };
            userOrder.images.push(ImageData);
            userOrder.save();
            const res = {
                name: randomFileName,
            };
            return res;
        }
        catch (e) {
            Sentry.captureException('Back end did not setup properly');
        }
    }
    catch (e) {
        Sentry.captureException('Image upload problem' + e);
        Sentry.captureException('There was an error uploading image');
        throw new Error(e);
    }
    return false;
};
const getAllMyImages = async (source, {}, { user: awaitedUser, Models: { orderModel } }) => {
    const user = await awaitedUser;
    const oneHour = moment_1.default()
        .subtract(2, 'hours')
        .utc();
    const myOrder = await orderModel
        .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
        .exec();
    if (!myOrder)
        throw new Error('Order not found');
    const res = myOrder.images.map(img => {
        return {
            name: img.name,
            base64: img.imageData,
        };
    });
    return res;
};
const getMyImage = async (source, { input }, { user: awaitedUser, Models: { orderModel, printSizeModel, optionModel } }) => {
    const user = await awaitedUser;
    const oneHour = moment_1.default()
        .subtract(2, 'hours')
        .utc();
    const myOrder = await orderModel
        .findOne({ userId: user.uid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
        .exec();
    if (!myOrder)
        throw new Error('order not found');
    const img = myOrder.images.find(img => img.name === input);
    if (!img)
        throw new Error('Image not found');
    const { optionValue: printDpi } = await optionModel.findOne({ optionKey: 'DPI' }).exec();
    const printSizes = await getPrintSizes({ width: img.width, height: img.height }, printDpi, printSizeModel);
    const imgBuffer = Buffer.from(img.imageData, 'base64');
    const grayscale = await sharp_1.default(imgBuffer)
        .grayscale()
        .jpeg({ quality: 100 })
        .toBuffer();
    return {
        name: img.name,
        base64: 'data:img/jpeg;base64, ' + img.imageData,
        base64GrayScale: 'data:img/jpeg;base64, ' + grayscale.toString('base64'),
        printSizes,
    };
};
const updateMyOrderImage = async (source, { input }, { user: awaitedUser, Models: { orderModel, productModel, printSizeModel } }) => {
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
        const img = myOrder.images.find(img => img.name === input.name);
        if (!img)
            throw new Error('Image not found');
        const selectedPrintSize = await printSizeModel.findById(input.selectedSize).exec();
        if (!selectedPrintSize)
            throw new Error('selected size is not valid');
        let finalImage;
        let price;
        let frameName = '';
        if (input.type === 'FRAMED_IMAGE') {
            //This is image and Frame
            price = selectedPrintSize.framePrice;
            const selectedFrame = await productModel.findById(input.selectedFrame).exec();
            if (!selectedFrame)
                throw new Error('No frame found');
            frameName = selectedFrame.name;
            const FrameBuffer = (await axios_1.default({
                url: cloudinaryUrl + selectedFrame.FramedImageThumbnail,
                responseType: 'arraybuffer',
            })).data;
            const imgBuffer = Buffer.from(input.scaledImage.split('data:image/png;base64,')[1], 'base64');
            const imgSize = await sharp_1.default(imgBuffer).metadata();
            finalImage = await sharp_1.default(FrameBuffer)
                .resize(imgSize.width + 160, imgSize.height + 160, { fit: 'fill' })
                .composite([{ input: imgBuffer, blend: 'saturate' }])
                .jpeg({ quality: 100 })
                .toBuffer();
            // .oFile(path.join(__dirname, uploadFolder, myOrder.orderFolder, img.name + '-finalclear'));
        }
        else {
            //This is print only
            finalImage = input.scaledImage.split('data:image/png;base64,')[1];
            price = selectedPrintSize.price;
        }
        await orderModel.findOneAndUpdate({ _id: myOrder.id, 'images._id': img.id }, {
            $set: {
                'images.$.finalImageData': finalImage.toString('base64'),
                'images.$.price': price,
                'images.$.quantity': input.quantity,
                'images.$.isBlackAndWite': input.isColor === 'full-color' ? false : true,
                'images.$.EditX': input.sizeInfo.x,
                'images.$.EditY': input.sizeInfo.y,
                'images.$.EditWidth': input.sizeInfo.width,
                'images.$.EditHeight': input.sizeInfo.height,
                'images.$.printWidth': selectedPrintSize.width,
                'images.$.printHeight': selectedPrintSize.height,
                'images.$.frameName': frameName,
            },
        });
        myOrder.orderTotal = myOrder.orderTotal + price;
        await myOrder.save();
        return true;
    }
    catch (e) {
        console.log('something is wrong\n', e);
    }
    return false;
};
exports.imageResolvers = {
    Query: {
        getAllMyImages: auth_resolvers_1.authenticated(getAllMyImages),
        getMyImage: auth_resolvers_1.authenticated(getMyImage),
    },
    Mutation: {
        singleImageFileUpload: auth_resolvers_1.authenticated(singleImageFileUpload),
        updateMyOrderImage: auth_resolvers_1.authenticated(updateMyOrderImage),
    },
};
//# sourceMappingURL=image.resolvers.js.map