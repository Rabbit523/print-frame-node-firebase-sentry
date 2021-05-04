import merge from 'lodash.merge';
require('dotenv').config();

let env;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  env = 'dev';
} else {
  env = process.env.NODE_ENV;
}

let baseConfig = {
  db: {
    Url: 'mongodb://localhost/SomeApp',
  },
  port: '3000',

  expireTime: 24 * 60 * 10,
};

let config: any = {};
switch (env) {
  case 'dev':
    config = require('./config/dev').default;
    break;
  case 'test':
    config = require('./config/test').default;
    break;
  case 'production':
    config = require('./config/prod').default;
    break;
  default:
    config = require('./config/dev').default;
}
export default merge(baseConfig, config);
