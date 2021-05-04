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
const cfsign = __importStar(require("aws-cloudfront-sign"));
const moment_1 = __importDefault(require("moment"));
// import aws from 'aws-sdk';
//TODO:Move all these to the config file
//TODO:move the base url to config and accept the path as args
exports.getSignedUrl = async () => {
    const signingParams = {
        keypairId: 'APKAIJKMQX5WERBLI3SA',
        //   privateKeyString: process.env.PRIVATE_KEY,
        // Optional - this can be used as an alternative to privateKeyString
        privateKeyPath: 'pk-APKAIJKMQX5WERBLI3SA.pem',
        expçireTime: moment_1.default()
            .add(5, 'minutes')
            .unix(),
    };
    try {
        // Generating a signed URL
        const signedUrl = await cfsign.getSignedUrl('https://secure.printandframeit.com/bg.jpg', signingParams);
        return signedUrl;
    }
    catch (e) {
        return null;
    }
};
//TODO:move the bucket name to config file
exports.s3Upload = async (FilePath, FileName) => {
    // const s3Bucket = 'secure.printandframeit.com';
    // const s3 = new aws.S3({
    //   accessKeyId: process.env.aws_access_key_id,
    //   secretAccessKey: process.env.aws_secret_access_key,
    //   signatureVersion: 'v4',
    //   region: 'us-east-1',
    // });
    // const s3Params = {
    //   Bucket: s3Bucket,
    //   Key: FilePath,
    //   Body: FileName,
    // };
    // const uploadToS3 = await s3;
};
exports.getSignedUrl();
//# sourceMappingURL=AwsSing.js.map