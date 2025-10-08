"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
// import { protect } from "../middleware/authMiddleware";
const router = express_1.default.Router();
router.get("/cars", adminController_1.getAllCars);
router.get("/cars/:id", adminController_1.getCarById);
exports.default = router;
