import { Request, Response } from "express";
import Inspection from "../models/InspectionModel";
import { IUser } from "../models/UserModel";
import { sendEmail } from "../utils/sendEmail";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface PopulatedInspection {
  user: { name: string; email: string };
  car: { brand: string; model: string; year: number };
  date: Date;
  location: string;
  status: string;
}

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
export const bookInspection = async (req: AuthRequest, res: Response) => {
  try {
    const { carId, date, location, phone, notes } = req.body;
    const inspectionDoc = await Inspection.create({
      user: req.user!._id,
      car: carId,
      date,
      location,
      phone,
      notes,
      status: "pending",
    });

    // 2. Refetch & populate (clean way)
    const inspection = await Inspection.findById(inspectionDoc._id)
      .populate("user", "name email phone")
      .populate("car", "brand model year");

    if (!inspection) {
      return res
        .status(404)
        .json({ message: "Inspection not found after creation" });
    }

    // 3. Send response
    res.status(201).json(inspection);
  } catch (error: any) {
    console.error("Error booking inspection:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllInspections = async (req: Request, res: Response) => {
  try {
    const inspections = await Inspection.find()
      .populate("user", "name email")
      .populate("car", "brand model")
      .sort({ createdAt: -1 });

    res.status(200).json(inspections);
  } catch (error: any) {
    console.error("Error fetching inspections:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInspection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inspection = (await Inspection.findById(id)
      .populate("user", "name email")
      .populate("car", "brand model year")) as
      | (PopulatedInspection & any)
      | null;

    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    inspection.status = status;

    await inspection.save();

    if (status === "confirmed" && inspection.user?.email) {
      await sendEmail(
        inspection.user.email,
        "Your Car Inspection is Confirmed",
        `
          <p>Hi ${inspection.user.name},</p>
          <p>Your inspection for <strong>${inspection.car.brand} ${
          inspection.car.model
        } (${inspection.car.year})</strong> has been confirmed.</p>
          <p><strong>Date:</strong> ${inspection.date.toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${inspection.location}</p>
          <p>Thank you for using our service!</p>
        `
      );
    }
  } catch (error: any) {
    console.error("Error updating inspection:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
