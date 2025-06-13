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
};

export default configENV;
