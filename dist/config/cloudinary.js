"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: "cars",
            allowed_formats: ["jpg", "png", "jpeg"],
            // public_id: file.originalname.split(".")[0],
        };
    },
});
exports.upload = (0, multer_1.default)({ storage });
// const upload = multer({ storage });
// export { cloudinary, upload };
// (async function () {
//   const results = await cloudinary.uploader.upload("../assets/logo.png");
//   console.log(results);
//   const url = cloudinary.url(results.public_id, {
//     transformation: [
//       {
//         quality: "auto",
//         fetch_format: "auto",
//       },
//       { width: 1200, height: 1200 },
//     ],
//   });
//   console.log(url);
// });
// (async () => {
//   const result = await cloudinary.uploader.upload("../assets/logo.png", {
//     folder: "sellCarRequests",
//     allowed_formats: ["jpg", "jpeg", "png"],
//   });
//   console.log(result);
// })();
// if (process.env.NODE_ENV !== "production") {
//   (global as any).cloudinary = cloudinary;
// }
// export default cloudinary;
