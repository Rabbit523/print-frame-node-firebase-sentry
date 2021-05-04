"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = require("body-parser");
const mongoose_1 = require("mongoose");
const cors_1 = require("cors");
const express_session_1 = require("express-session");
const passport_1 = require("passport");
const connect_mongo_1 = require("connect-mongo");
const connect_flash_1 = require("connect-flash");
const express_rate_limit_1 = require("express-rate-limit");
const api_1 = require("./api");
const config_1 = require("./config");
const passport_setup_1 = require("./api/resources/auth/passport-setup");
const auth_controller_1 = require("./api/resources/auth/auth.controller");
if (process.env.NODE_ENV !== "test") {
    console.log("Db url is:" + config_1.default.db.Url);
}
exports.mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};
try {
    if (process.env.NODE_ENV === "production") {
        mongoose_1.default.connect(config_1.default.db.Url, {
            ...exports.mongooseOptions,
            pass: config_1.default.db.PASSWORD,
            user: config_1.default.db.USERNAME
        });
    }
    else {
        mongoose_1.default.connect(config_1.default.db.Url, exports.mongooseOptions);
    }
}
catch (e) {
    console.log(e);
    process.exit(1);
}
const app = express_1.default();
const MongoStore = connect_mongo_1.default(express_session_1.default);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
if (process.env.NODE_ENV === "production") {
    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // see https://expressjs.com/en/guide/behind-proxies.html
    app.set("trust proxy", 1);
    const limiter = express_rate_limit_1.default({
        windowMs: 15 * 60 * 1000,
        max: 100 // limit each IP to 100 requests per windowMs
    });
    //  apply to all requests
    app.use(limiter);
}
/** cors will let use use cross origin cookies for this specific url*/
app.use(cors_1.default({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express_session_1.default({
    name: "qid",
    secret: config_1.default.secrets.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    },
    store: new MongoStore({ mongooseConnection: mongoose_1.default.connection })
}));
// initialize passport
app.use(connect_flash_1.default());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_setup_1.default;
// app.use("/static", express.static("public"));
/** This file has to be changed with our react app*/
app.get("/", function (req, res) {
    // res.sendFile("index.html", { root: __dirname + "/public" });
    res.status(401).send("Access denied");
});
/**
 *  In playground we have to set the credential as same-origin
 *  https://github.com/prisma/graphql-playground/issues/748#issuecomment-412524510
 */
app.use("/api", api_1.restRouter);
const gqlPath = "/graphql";
app.use(gqlPath, auth_controller_1.authCheck);
/**
 * if I don't setup cors: false it will override the corse on top!!
 */
api_1.graphQLServer.applyMiddleware({
    app,
    path: gqlPath,
    cors: false
});
exports.default = app;
//# sourceMappingURL=server.js.map