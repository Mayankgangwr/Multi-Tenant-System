// src/config/env.config.ts
import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
    port: process.env.PORT || 3000,
    localCorsOrigin: process.env.LOCAL_CORS_ORIGIN || 'http://localhost:3000',

    databaseUri: process.env.DATABASE_URI || '',

    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',

    cashfree: {
        env: process.env.CF_ENV || 'SANDBOX',
        appId: process.env.CF_APP_ID || '',
        secretKey: process.env.CF_SECRET_KEY || '',
        webhookSecret: process.env.CF_WEBHOOK_SECRET || '',
    },

    ngrokToken: process.env.NGROCK_AUTH_TOKEN || '',
};
export default envConfig