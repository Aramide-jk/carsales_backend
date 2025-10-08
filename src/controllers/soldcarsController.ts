// controllers/carController.ts
import { Request, Response } from "express";
import Car from "../models/CarModel";

// export const getSoldCars = async (req: Request, res: Response) => {
//   try {
//     const cars = await Car.find({ status: "sold" }).sort({ updatedAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: cars.length,
//       data: cars,
//     });
//   } catch (error) {
//     console.error("Error fetching sold cars:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const getSoldCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find({ status: "sold" }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching sold cars:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
