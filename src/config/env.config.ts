import dotenv from 'dotenv';

dotenv.config({
  path: './.env'
});

const configENV = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URI: process.env.DATABASE_URI || "mongodb://localhost:27017",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'D2DCDC74FD7D3F6FD138F36EDFC81',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '95958DF847436FBCAFA92FA1ED1FD',
  LOCAL_CORS_ORIGIN: process.env.LOCAL_CORS_ORIGIN || 'http://localhost:3000',
  CF_ENV: process.env.CF_ENV || `SANDBOX`,
  CF_APP_ID: process.env.CF_APP_ID || `TEST430329ae80e0f32e41a393d78b923034`,
  CF_SECRET_KEY: process.env.CF_SECRET_KEY || `TESTaf195616268bd6202eeb3bf8dc458956e7192a85`
};

export default configENV;
