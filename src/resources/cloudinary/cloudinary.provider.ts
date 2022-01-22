import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConstants } from 'src/common/constants';
import { CLOUDINARY } from './constant';

const { cloud_name, api_key, api_secret } = cloudinaryConstants;

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
  },
};
