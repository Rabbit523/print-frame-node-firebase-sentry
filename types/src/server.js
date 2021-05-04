"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const api_1 = require("./api");
const config_1 = __importDefault(require("./config"));
const Sentry = __importStar(require("@sentry/node"));
const serviceAccount = require('../fireBaseInfo.json');
const admin = __importStar(require("firebase-admin"));
exports.FireBaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://print-and-frame-it.firebaseio.com',
});
if (process.env.NODE_ENV !== 'test') {
    Sentry.captureException('Db url is:' + config_1.default.db.Url);
}
exports.mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};
try {
    if (process.env.NODE_ENV === 'production') {
        mongoose_1.default.connect(config_1.default.db.Url, {
            ...exports.mongooseOptions,
            pass: config_1.default.db.PASSWORD,
            user: config_1.default.db.USERNAME,
        });
    }
    else {
        mongoose_1.default.connect(config_1.default.db.Url, exports.mongooseOptions);
    }
}
catch (e) {
    Sentry.captureException(e);
    process.exit(1);
}
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
// app.use(bodyParser.json());
if (process.env.NODE_ENV === 'production') {
    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // see https://expressjs.com/en/guide/behind-proxies.html
    app.set('trust proxy', 1);
    const limiter = express_rate_limit_1.default({
        windowMs: 15 * 60 * 1000,
        max: 100,
    });
    //  apply to all requests
    app.use(limiter);
}
/** cors will let use use cross origin cookies for this specific url*/
const AllowedOrigins = [config_1.default.FRONTEND_URL, 'http://localhost:8000', 'http://localhost:3000'];
app.use(cors_1.default({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
}));
app.get('/', function (req, res) {
    res.status(401).send('Access denied');
});
/**
 *  In playground we have to set the credential as same-origin
 *  https://github.com/prisma/graphql-playground/issues/748#issuecomment-412524510
 */
app.use('/api', api_1.restRouter);
const gqlPath = '/graphql';
/**
 * if I don't setup cors: false it will override the corse on top!!
 */
if (process.env.NODE_ENV !== 'test') {
    api_1.graphQLServer.applyMiddleware({
        app,
        path: gqlPath,
        cors: false,
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map