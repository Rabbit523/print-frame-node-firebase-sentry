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
const passport_1 = __importDefault(require("passport"));
const gStrategy = __importStar(require("passport-google-oauth2"));
const local_strategy = __importStar(require("passport-local"));
const fbStrategy = __importStar(require("passport-facebook"));
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = require("../user/user.model");
const GoogleStrategy = gStrategy.Strategy;
const LocalStrategy = local_strategy.Strategy;
const FacebookStrategy = fbStrategy.Strategy;
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    user_model_1.userModel.findById(id).then(user => {
        done(null, user);
    });
});
passport_1.default.use(new GoogleStrategy({
    clientID: config_1.default.accounts.GOOGLE_CLIENT_ID,
    clientSecret: config_1.default.secrets.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
    const googleUser = await user_model_1.userModel
        .findOne({ googleId: profile.id })
        .exec();
    if (!googleUser) {
        //This user does not have a google profile for sure, let's see if she has a profile with email
        const emailUser = await user_model_1.userModel
            .findOne({
            userEmail: profile.email
        })
            .exec();
        if (!emailUser) {
            // We checked the googleId and the email we know that the user does not exist on our system
            const newUser = await user_model_1.userModel.create({
                userEmail: profile.email,
                userName: profile.email,
                googleId: profile.id
            });
            user_model_1.userMeta.create([
                {
                    metaKey: "familyName",
                    metaValue: profile.name.familyName,
                    userId: newUser.id
                },
                {
                    metaKey: "givenName",
                    metaValue: profile.name.givenName,
                    userId: newUser.id
                },
                {
                    metaKey: "image",
                    metaValue: profile.photos[0].value,
                    userId: newUser.id
                },
                {
                    metaKey: "role",
                    metaValue: 1,
                    userId: newUser.id
                }
            ]);
            if (profile._json.gender) {
                user_model_1.userMeta.create([
                    {
                        metaKey: "gender",
                        metaValue: profile._json.gender,
                        userId: newUser.id
                    }
                ]);
            }
            return done(null, newUser);
        }
        else {
            //we have the user but she does not have the google id, let's update her googleId
            emailUser.googleId = profile.id;
            await emailUser.save();
            return done(null, emailUser);
        }
    }
    else {
        // We have the user in our system we can set the session and let her in
        return done(null, googleUser);
    }
}));
passport_1.default.use(new FacebookStrategy({
    clientID: config_1.default.accounts.FACEBOOK_APP_ID,
    clientSecret: config_1.default.secrets.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/fb/callback",
    profileFields: [
        "id",
        "displayName",
        "email",
        "birthday",
        "friends",
        "first_name",
        "last_name",
        "middle_name",
        "gender",
        "link"
    ]
}, async function (accessToken, refreshToken, profile, done) {
    console.log(JSON.stringify(profile, null, 4));
    const fbUser = await user_model_1.userModel.findOne({ fbId: profile.id }).exec();
    if (!fbUser) {
        //This user does not have a fb profile we can check to see if the email exist
        const emailUser = await user_model_1.userModel
            .findOne({ userEmail: profile._json.email })
            .exec();
        if (!emailUser) {
            const newUser = await user_model_1.userModel.create({
                userEmail: profile._json.email,
                userName: profile._json.email,
                fbId: profile.id
            });
            user_model_1.userMeta.create([
                {
                    metaKey: "familyName",
                    metaValue: profile.name.familyName,
                    userId: newUser.id
                },
                {
                    metaKey: "givenName",
                    metaValue: profile.name.givenName,
                    userId: newUser.id
                },
                {
                    metaKey: "role",
                    metaValue: 1,
                    userId: newUser.id
                }
            ]);
            return done(null, newUser);
        }
        else {
            //This user has the email so just update the fbId and log him in
            emailUser.fbId = profile._json.email;
            await emailUser.save();
            return done(null, emailUser);
        }
    }
    else {
        // We have the user in our system we can set the session and let her in
        return done(null, fbUser);
    }
}));
passport_1.default.use(new LocalStrategy(async function (username, password, done) {
    try {
        const user = await user_model_1.userModel.findOne({ userName: username }).exec();
        if (!user)
            return done(null, false);
        if (!user.authenticate(password))
            return done(null, false);
        return done(null, user);
    }
    catch (e) {
        return done(e);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport-setup.js.map