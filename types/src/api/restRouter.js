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
const Image_1 = require("./resources/Image");
const Sentry = __importStar(require("@sentry/node"));
exports.restRouter = express_1.default.Router();
exports.restRouter.use('/image', Image_1.imageRouter);
//TODO I have to write an api error handler for this!!
exports.restRouter.all('*', (req, res) => {
    Sentry.captureException('not valid route');
    Sentry.captureException(req.path);
    res.json({ erro: 'not valid route' });
});
//# sourceMappingURL=restRouter.js.map