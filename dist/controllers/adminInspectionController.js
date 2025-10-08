"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInspectionStatus = exports.getAllInspections = void 0;
const InspectionModel_1 = __importDefault(require("../models/InspectionModel"));
const getAllInspections = async (req, res) => {
    try {
        const inspections = await InspectionModel_1.default.find()
            .populate("user", "name email")
            .populate("car", "brand model price")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: inspections.length,
            data: inspections,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while fetching inspections",
        });
    }
};
exports.getAllInspections = getAllInspections;
const updateInspectionStatus = async (req, res) => {
    try {
        const { status } = req.body; // expected: "confirmed", "cancelled", "completed"
        const { id } = req.params;
        if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed: pending, confirmed, cancelled, completed",
            });
        }
        const inspection = await InspectionModel_1.default.findById(id);
        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found",
            });
        }
        inspection.status = status;
        await inspection.save();
        return res.status(200).json({
            success: true,
            message: `Inspection marked as ${status}`,
            data: inspection,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while updating inspection",
        });
    }
};
exports.updateInspectionStatus = updateInspectionStatus;
