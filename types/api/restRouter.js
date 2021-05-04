"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./resources/auth");
exports.restRouter = express_1.default.Router();
// restRouter.use("/user",userRouter)
exports.restRouter.use("/auth", auth_1.authRouter);
//TODO I have to write an api error handler for this!!
exports.restRouter.all("*", (req, res) => {
    console.log("not valid route");
    console.log(req.path);
    res.json({ erro: "api call not found" });
});
//# sourceMappingURL=restRouter.js.map