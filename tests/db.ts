import mongoose from 'mongoose';
import config from '../src/config';
import { Models } from '../src/api/graphQLRouter';
import { mongooseOptions } from './../src/server';

const cleanDB = async () => {
  await Object.keys(Models).forEach(async key => {
    await Models[key].deleteMany({});
  });
};

const connectToDB = async () => {
  // console.log('connecting to db' + config.db.Url);
  return await mongoose.connect(config.db.Url, mongooseOptions);
};
const disconnectDB = async (done = () => {}) => {
  await mongoose.disconnect(done);
};

const generateMongooseId = () => {
  return mongoose.Types.ObjectId();
};

export const dbTools = {
  cleanDB,
  connectToDB,
  disconnectDB,
  generateMongooseId,
};
