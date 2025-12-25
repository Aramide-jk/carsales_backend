import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/profile", getProfile);

export default router;
