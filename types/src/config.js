"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
require('dotenv').config();
let env;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    env = 'dev';
}
else {
    env = process.env.NODE_ENV;
}
let baseConfig = {
    db: {
        Url: 'mongodb://localhost/SomeApp',
    },
    port: '3000',
    expireTime: 24 * 60 * 10,
};
let config = {};
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
exports.default = lodash_merge_1.default(baseConfig, config);
//# sourceMappingURL=config.js.map