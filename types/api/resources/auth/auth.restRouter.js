"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = require("passport");
const auth_controller_1 = require("./auth.controller");
exports.authRouter = express_1.default.Router();
exports.authRouter
    .route("/google/callback")
    .get(passport_1.default.authenticate("google"), auth_controller_1.authCheck, (req, res) => {
    res.redirect("/");
});
exports.authRouter.route("/google").get(passport_1.default.authenticate("google", {
    scope: ["profile", "email"]
}));
exports.authRouter.route("/local").post(passport_1.default.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/local"
}));
exports.authRouter.route("/fb").get(passport_1.default.authenticate("facebook", {
    scope: ["email", "public_profile"]
}));
exports.authRouter.route("/fb/callback").get(passport_1.default.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/api/auth/fb/"
}));
exports.authRouter.route("/fb/callback/2").get(auth_controller_1.authCheck, (req, res) => {
    res.send("ok");
});
exports.authRouter.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
//# sourceMappingURL=auth.restRouter.js.map