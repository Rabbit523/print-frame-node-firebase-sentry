import express from 'express';
import * as orderController  from './order.controller';

const orderRouter = express.Router()

orderRouter.route('/:orderId/images/:imageName')
  /** GET /api/:orderId/images/:imageName - Get image */
  .get(orderController.get)
orderRouter.route('/:orderId/invoice')
  .get(orderController.getInvoice)
orderRouter.route('/:orderId/imagelist')
  .get(orderController.getImagelist)

export default orderRouter 