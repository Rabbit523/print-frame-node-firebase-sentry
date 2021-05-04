import express from 'express';
import { restAuth } from '../auth/auth.restRouter';
import { userRoles } from '../../generalInterfaces';
import { imageControler } from './image.controler';
export const imageRouter = express.Router();
imageRouter.get(
  '/:orderId/:imageName',
  restAuth.authenticated,
  restAuth.authorized(userRoles.admin),
  imageControler.getImage,
);
imageRouter.get(
  '/final/:orderId/:imageName',
  restAuth.authenticated,
  restAuth.authorized(userRoles.admin),
  imageControler.getEdittedImage,
);

export default imageRouter;
