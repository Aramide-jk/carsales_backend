"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inspectionController_1 = require("../controllers/inspectionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// User books inspection
router.post("/", authMiddleware_1.protect, inspectionController_1.bookInspection);
// Admin views + updates inspections
router.get("/", authMiddleware_1.protect, authMiddleware_1.admin, inspectionController_1.getAllInspections);
router.patch("/:id/status", authMiddleware_1.protect, authMiddleware_1.admin, inspectionController_1.updateInspection);
exports.default = router;
