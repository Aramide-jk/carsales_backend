"use strict";
// import express from "express";
// import { uploadCarImages } from "../controllers/imageController";
// import { protect, admin } from "../middleware/authMiddleware";
// import { upload } from "../middleware/multer";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.post(
//   "/cars",
//   protect,
//   admin,
//   upload.array("images", 20),
//   uploadCarImages as express.RequestHandler
// );
// export default router;
const express_1 = __importDefault(require("express"));
const uploadPost_1 = __importDefault(require("../middleware/uploadPost"));
const imageController_1 = require("../controllers/imageController");
const router = express_1.default.Router();
// Single image upload
router.post("/upload", uploadPost_1.default.single("image"), imageController_1.uploadImage);
// Delete by DB id
router.delete("/:id", imageController_1.deleteImage);
exports.default = router;
