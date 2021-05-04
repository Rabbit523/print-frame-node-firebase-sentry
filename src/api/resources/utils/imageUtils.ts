import { createWriteStream, unlink } from 'fs';
import * as Sentry from '@sentry/node';
export const WriteFileToDisk = async (createReadStream: any, maxLength: number, filePath: string) => {
  let dataLength = 0;
  try {
    await new Promise((resolve, reject) =>
      createReadStream()
        .on('data', function(chunk) {
          dataLength += chunk.length;
          if (dataLength > maxLength) {
            reject('File size too big');
            return new Error('File size too big');
          }
          return true;
        })
        .pipe(createWriteStream(filePath))
        .on('close', () => {
          resolve(filePath);
        })
        .on('error', err => {
          Sentry.captureException(err);
          reject(err);
        }),
    );
  } catch (e) {
    if (e === 'File size too big') {
      unlink(filePath, err => {
        Sentry.captureException('File could not be deleted' + err);
      });
      Sentry.captureException(e);
    }
  }
};

export const getPrintSizes = async (
  imgSize: { height: number; width: number },
  printDpi: number,
  printSizeModel: any,
) => {
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
  } catch (e) {
    Sentry.captureException('print size problem' + e);
  }
};
