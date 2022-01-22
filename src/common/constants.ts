import { config } from 'dotenv';

config();
export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const dbconstants = {
  database: process.env.DB_NAME,
};

export const cloudinaryConstants = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
