"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminCarRequestController_1 = require("../controllers/adminCarRequestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadSell_1 = require("../middleware/uploadSell");
// console.log("UPLOAD:", upload);
const router = express_1.default.Router();
const uploadFields = uploadSell_1.upload.fields([
    { name: "interiorImages", maxCount: 10 },
    { name: "exteriorImages", maxCount: 10 },
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 },
    { name: "carReg", maxCount: 1 },
    { name: "customPaper", maxCount: 1 },
]);
router.post("/", authMiddleware_1.protect, uploadFields, adminCarRequestController_1.createRequest);
router.get("/", authMiddleware_1.protect, authMiddleware_1.admin, adminCarRequestController_1.getRequests);
exports.default = router;
