import express from 'express';
import { imageRouter } from './resources/Image';
import * as Sentry from '@sentry/node';

export const restRouter = express.Router();

restRouter.use('/image', imageRouter);
//TODO I have to write an api error handler for this!!
restRouter.all('*', (req, res) => {
  Sentry.captureException('not valid route');
  Sentry.captureException(req.path);
  res.json({ erro: 'not valid route' });
});
