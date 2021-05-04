"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flatted_1 = __importDefault(require("flatted"));
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter
    .route("/success")
    .post((req, res) => {
    console.log("in payment");
    console.log(flatted_1.default.stringify(req.body));
    res.redirect("/");
})
    .get((req, res) => {
    console.log("in get");
    console.log(flatted_1.default.stringify(req.body));
});
//# sourceMappingURL=payment.restRouter.js.map