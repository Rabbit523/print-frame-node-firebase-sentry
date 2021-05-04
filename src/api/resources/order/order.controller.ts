import { orderModel} from './order.model'
var path = require('path');
var mime = require('mime');
var fs = require('fs');
// var fs = require('fs');
const uploadPath = path.join(__dirname, '/../../../../uploads');
const orderPath = path.join(__dirname,'/../../../../orders');
const getModifyFileName = (fileName, modifier) => {
    return fileName.split('.').slice(0, -1).join('.') + `-${modifier}.` + fileName.split('.').pop()
  }
  
export const get = (req, res, next) => {
orderModel.find({ orderId: req.params.orderId})
    .exec()
    .then((order)=> {
    const imagePath = `${uploadPath}/${order[0].orderFolder}/${req.params.imageName}`
    const finalImageName = getModifyFileName(req.params.imageName, 'final');
    const originalPath = `${uploadPath}/${order[0].orderFolder}/${finalImageName}`
    return res.json({ originalImagePath: imagePath, finalImagePath: originalPath });
    }, (e) => next(e))
}

export const getInvoice = (req, res, next) => {
    orderModel.find({ orderId: req.params.orderId})
    .exec()
    .then((order)=> {
        var file = `${uploadPath}/${order[0].orderFolder}/Invoice.pdf`;
        var filename = path.basename(file);
        var mimetype = mime.getType(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res); 
    }, (e) => next(e))
}

export const getImagelist = (req, res, next) => {
    orderModel.find({ orderId: req.params.orderId})
    .exec()
    .then((order)=> {
        var file = `${uploadPath}/${order[0].orderFolder}/Pictures.pdf`;
        var filename = path.basename(file);
        var mimetype = mime.getType(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res); 
    }, (e) => next(e))
}