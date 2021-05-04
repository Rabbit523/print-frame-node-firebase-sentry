import sharp from 'sharp';
import path from 'path';
const uploadFolder = '/../../../uploads';
export const cropImage = ({
  imgName,
  imgExtension,
  imgWidth,
  imgHeight,
  EditX,
  EditY,
  EditWidth,
  EditHeight,
  isGrayScale,
  orderFolder,
}) => {
  const filepath = path.join(__dirname, uploadFolder, orderFolder, imgName + '.' + imgExtension);
  const destPath = path.join(__dirname, uploadFolder, orderFolder, imgName + '-final.' + imgExtension);
  console.log('file path is', filepath, 'dest file is ', destPath);
  if (isGrayScale) {
    sharp(filepath)
      .jpeg({ quality: 100, progressive: true })
      .extract({
        left: Math.floor(imgWidth * EditX),
        top: Math.floor(imgHeight * EditY),
        width: Math.floor(imgWidth * EditWidth),
        height: Math.floor(imgHeight * EditHeight),
      })
      .grayscale()
      .toFile(destPath, function(err) {
        err && console.log('color error', err);
        // Extract a region of the input image, saving in the same format.
      });
  } else {
    sharp(filepath)
      .jpeg({ quality: 100, progressive: true })
      .extract({
        left: Math.floor(imgWidth * EditX),
        top: Math.floor(imgHeight * EditY),
        width: Math.floor(imgWidth * EditWidth),
        height: Math.floor(imgHeight * EditHeight),
      })
      .toFile(destPath, function(err) {
        err && console.log(err);
        // Extract a region of the input image, saving in the same format.
      });
  }
};
