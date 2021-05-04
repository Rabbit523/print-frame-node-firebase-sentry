import * as cfsign from 'aws-cloudfront-sign';
import moment from 'moment';
// import aws from 'aws-sdk';

//TODO:Move all these to the config file
//TODO:move the base url to config and accept the path as args
export const getSignedUrl = async () => {
  const signingParams = {
    keypairId: 'APKAIJKMQX5WERBLI3SA',
    //   privateKeyString: process.env.PRIVATE_KEY,
    // Optional - this can be used as an alternative to privateKeyString
    privateKeyPath: 'pk-APKAIJKMQX5WERBLI3SA.pem',
    expçireTime: moment()
      .add(5, 'minutes')
      .unix(),
  };
  try {
    // Generating a signed URL
    const signedUrl = await cfsign.getSignedUrl('https://secure.printandframeit.com/bg.jpg', signingParams);

    return signedUrl;
  } catch (e) {
    return null;
  }
};
//TODO:move the bucket name to config file
export const s3Upload = async (FilePath: string, FileName: string) => {
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
getSignedUrl();
