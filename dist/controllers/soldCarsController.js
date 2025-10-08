"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoldCars = void 0;
const CarModel_1 = __importDefault(require("../models/CarModel"));
const getSoldCars = async (req, res) => {
    try {
        const cars = await CarModel_1.default.find({ status: "sold" }).sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            count: cars.length,
            data: cars,
        });
    }
    catch (error) {
        console.error("Error fetching sold cars:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getSoldCars = getSoldCars;
