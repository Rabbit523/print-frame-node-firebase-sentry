export default {
  db: {
    Url: process.env.PROD_DB,
    USERNAME: process.env.DEV_DB_USERNAME,
    PASSWORD: process.env.DEV_DB_PASSWORD,
  },
  siteUrl: process.env.PROD_URL,
  FRONTEND_URL: process.env.PROD_FRONTEND_URL,
  TWILIO_NUMBER: process.env.TWILIO_NUMBER,
  accounts: {
    TWILIO_TEST_SID: process.env.TWIILIO_TEST_SID,
    TWILIO_SID: process.env.TWILIO_SID,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    CLCLOUDINARY_NAME: process.env.CLCLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  },
  secrets: {
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    TWILIO_TEST_TOKEN: process.env.TWILIO_TEST_TOKEN,
    TWILIO_TOKEN: process.env.TWILIO_TOKEN,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    EASYPOST: process.env.EASYPOST_PROD,
  },
};
