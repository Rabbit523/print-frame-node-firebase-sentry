"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const unique_filename_1 = require("unique-filename");
const sharp_1 = require("sharp");
const sizeOf = util_1.promisify(require("image-size"));
const generalInterfaces_1 = require("../../generalInterfaces");
const singleImageFileUpload = async (source, { input: file }, { req, Models: { orderModel, imageModel, optionModel, printSizeModel } }) => {
    const { createReadStream, filename } = await file;
    const extension = filename.split(".").pop();
    if (!["jpeg", "gif", "png", "jpg"].includes(extension.toLowerCase())) {
        throw new Error("Image extension not supported");
    }
    const randomFileName = unique_filename_1.default("") + "." + extension;
    let filePath = path_1.default.join(__dirname, "/../../../../uploads", randomFileName);
    //TODO: move the max file size into the system config
    //TODO:Test this through
    // const maxLength = 50 * 1000000;
    const { optionValue: maxLength } = await optionModel
        .findOne({
        optionKey: "MaxImageSize"
    })
        .exec();
    let dataLength = 0;
    try {
        await new Promise((resolve, reject) => createReadStream()
            .on("data", function (chunk) {
            dataLength += chunk.length;
            if (dataLength > maxLength) {
                reject("File size too big");
                return new Error("File size too big");
            }
        })
            .pipe(fs_1.createWriteStream(filePath))
            .on("close", () => {
            resolve(filePath);
        })
            .on("error", err => {
            console.error(err);
            reject(err);
        }));
    }
    catch (e) {
        if (e === "File size too big") {
            fs_1.unlink(filePath, err => {
                console.error("File could not be deleted", err);
            });
            throw new Error(e);
        }
    }
    const imgSize = await sizeOf(filePath);
    //This 100 * 100 is the image print dpit
    //TODO: move this quality from here to db so it will be dynamic
    const dpi = (imgSize.height * imgSize.width) / (100 * 100);
    const printSizes = await printSizeModel.find({
        widthHeight: { $lt: dpi },
        disabled: false
    });
    if (!req.session.orderId) {
        const order = await orderModel.create({ orderStatus: generalInterfaces_1.orderStatus.started });
        req.session.orderId = order.id;
    }
    const img = await sharp_1.default(filePath.toString())
        .resize(500, 300, { fit: "outside" })
        .jpeg()
        .rotate(90)
        .toBuffer();
    imageModel.create({
        orderId: req.session.orderId,
        s3key: req.session.orderId + "/" + randomFileName
    });
    let base64 = Buffer.from(img).toString("base64");
    base64 = "data:img/jpeg;base64, " + base64;
    return {
        base64,
        printSizes
    };
};
exports.imageResolvers = {
    Query: {},
    Mutation: {
        singleImageFileUpload
    }
};
//# sourceMappingURL=image.resolvers.js.map