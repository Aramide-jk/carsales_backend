"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/carRoutes.ts
const express_1 = __importDefault(require("express"));
const soldcarsController_1 = require("../controllers/soldcarsController");
const router = express_1.default.Router();
// GET /api/cars/sold
router.get("/sold", soldcarsController_1.getSoldCars);
exports.default = router;
