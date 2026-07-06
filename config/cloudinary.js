import dotenv from "dotenv";
// Load env variables
dotenv.config();

import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Console check karo
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

// Storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "aranya-products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
});

// Multer upload
export const upload = multer({ storage });

export default cloudinary;