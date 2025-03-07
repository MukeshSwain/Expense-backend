import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

export const uploadImage = async (file) => {
    try {
       return  await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
        })
    } catch (error) {
        console.log(error.message);
        
    }
 }





