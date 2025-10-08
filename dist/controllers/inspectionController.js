"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInspection = exports.getAllInspections = exports.bookInspection = void 0;
const InspectionModel_1 = __importDefault(require("../models/InspectionModel"));
const sendEmail_1 = require("../utils/sendEmail");
// export const bookInspection = async (req: AuthRequest, res: Response) => {
//   try {
//     const { carId, date, location, phone, note } = req.body;
//     const inspection = await Inspection.create({
//       user: req.user!._id,
//       car: carId,
//       date,
//       location,
//       phone,
//       note,
//       status: "pending",
//     });
//     res.status(201).json(inspection);
//   } catch (error: any) {
//     console.error("Error booking inspection:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// =======================
// Admin: Get all inspections
// =======================
const bookInspection = async (req, res) => {
    try {
        const { carId, date, location, phone, notes } = req.body;
        const inspectionDoc = await InspectionModel_1.default.create({
            user: req.user._id,
            car: carId,
            date,
            location,
            phone,
            notes,
            status: "pending",
        });
        // 2. Refetch & populate (clean way)
        const inspection = await InspectionModel_1.default.findById(inspectionDoc._id)
            .populate("user", "name email phone")
            .populate("car", "brand model year");
        if (!inspection) {
            return res
                .status(404)
                .json({ message: "Inspection not found after creation" });
        }
        // 3. Send response
        res.status(201).json(inspection);
    }
    catch (error) {
        console.error("Error booking inspection:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
exports.bookInspection = bookInspection;
const getAllInspections = async (req, res) => {
    try {
        const inspections = await InspectionModel_1.default.find()
            .populate("user", "name email")
            .populate("car", "brand model")
            .sort({ createdAt: -1 });
        res.status(200).json(inspections);
    }
    catch (error) {
        console.error("Error fetching inspections:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllInspections = getAllInspections;
const updateInspection = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const inspection = (await InspectionModel_1.default.findById(id)
            .populate("user", "name email")
            .populate("car", "brand model year"));
        if (!inspection) {
            return res.status(404).json({ message: "Inspection not found" });
        }
        inspection.status = status;
        await inspection.save();
        if (status === "confirmed" && inspection.user?.email) {
            await (0, sendEmail_1.sendEmail)(inspection.user.email, "Your Car Inspection is Confirmed", `
          <p>Hi ${inspection.user.name},</p>
          <p>Your inspection for <strong>${inspection.car.brand} ${inspection.car.model} (${inspection.car.year})</strong> has been confirmed.</p>
          <p><strong>Date:</strong> ${inspection.date.toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${inspection.location}</p>
          <p>Thank you for using our service!</p>
        `);
        }
    }
    catch (error) {
        console.error("Error updating inspection:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateInspection = updateInspection;
