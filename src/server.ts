import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { restRouter, graphQLServer } from './api';
import config from './config';
import * as Sentry from '@sentry/node';

const serviceAccount = require('../fireBaseInfo.json');
import * as admin from 'firebase-admin';

export const FireBaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://print-and-frame-it.firebaseio.com',
});

export const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

try {
  mongoose.connect(config.db.Url, mongooseOptions);
} catch (e) {
  Sentry.captureException(e);
  process.exit(1);
}
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // see https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', 1);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  //  apply to all requests
  app.use(limiter);
}
/** cors will let use use cross origin cookies for this specific url*/
const AllowedOrigins = [config.FRONTEND_URL, 'http://localhost:8000', 'http://localhost:3000'];
app.use(
  cors({
    origin: function(origin, callback) {
      callback(null, true);
    },
    credentials: true,
  }),
);

app.get('/', function(req, res) {
  res.status(401).send('Access denied');
});

/**
 *  In playground we have to set the credential as same-origin
 *  https://github.com/prisma/graphql-playground/issues/748#issuecomment-412524510
 */

app.use('/api', restRouter);

const gqlPath = '/graphql';

/**
 * if I don't setup cors: false it will override the corse on top!!
 */
if (process.env.NODE_ENV !== 'test') {
  graphQLServer.applyMiddleware({
    app,
    path: gqlPath,
    cors: false,
  });
}

export default app;
