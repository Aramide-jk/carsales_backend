// import express from "express";
// import { uploadCarImages } from "../controllers/imageController";
// import { protect, admin } from "../middleware/authMiddleware";
// import { upload } from "../middleware/multer";

// const router = express.Router();

// router.post(
//   "/cars",
//   protect,
//   admin,
//   upload.array("images", 20),
//   uploadCarImages as express.RequestHandler
// );

// export default router;

import express from "express";
import upload from "../middleware/uploadPost";
import { uploadImage, deleteImage } from "../controllers/imageController";

const router = express.Router();

// Single image upload
router.post("/upload", upload.single("image"), uploadImage);

// Delete by DB id
router.delete("/:id", deleteImage);

export default router;
