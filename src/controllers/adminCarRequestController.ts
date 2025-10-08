import { Request, Response } from "express";
import SellCar, { ISellCarRequest } from "../models/SellCarRequestModel";
import { AuthRequest } from "../types/type.auth";
import { sendEmail } from "../utils/sendEmail";
import { IUser } from "../models/UserModel";

interface CloudinaryFile extends Express.Multer.File {
  path: string;
}

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const {
      brand,
      model,
      year,
      mileage,
      engine,
      description,
      location,
      serviceHistory,
      modifications,
      reason,
      price,
      ownerName,
      ownerEmail,
      ownerPhone,
    } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const files = req.files as { [fieldname: string]: CloudinaryFile[] };

    const interiorImages =
      files?.interiorImages?.map((file) => file.path) || [];
    const exteriorImages =
      files?.exteriorImages?.map((file) => file.path) || [];

    const idFront = files?.idFront?.[0]?.path;
    const idBack = files?.idBack?.[0]?.path;
    const carReg = files?.carReg?.[0]?.path;
    const customPaper = files?.customPaper?.[0]?.path;

    let features: string[] = [];
    if (typeof req.body.features === "string") {
      try {
        features = JSON.parse(req.body.features);
      } catch {
        features = req.body.features
          .split(",")
          .map((item: string) => item.trim());
      }
    } else if (Array.isArray(req.body.features)) {
      features = req.body.features;
    }

    const sellRequest = await SellCar.create({
      user: req.user._id,
      brand,
      model,
      year,
      mileage,
      engine,
      description,
      serviceHistory,
      modifications,
      reason,
      location,
      price,
      features,
      ownerName,
      ownerEmail,
      ownerPhone,
      interiorImages,
      exteriorImages,
      idFront,
      idBack,
      carReg,
      customPaper,
      status: "pending",
    });

    res.status(201).json(sellRequest);
  } catch (error: any) {
    console.error("Error creating sell car request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating request",
    });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await SellCar.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching sell car requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSellCarStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status input
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Allowed: pending, approved, rejected",
      });
    }

    // Find request
    const request = await SellCar.findById(id).populate<{ user: IUser }>(
      "user",
      "name email"
    );
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sell request not found",
      });
    }

    // Update status
    request.status = status;
    await request.save();

    // Send email notification
    if (request.user) {
      const subject = `Your car sell request has been ${status}`;
      const message = `
        Hi ${request.user.name || "User"},

        Your request to sell your car has been *${status}*.

        Thank you for using JK Autos.
      `;

      try {
        await sendEmail(request.user.email, subject, message);
      } catch (mailError) {
        console.error("Email sending failed:", mailError);
      }
    }

    return res.status(200).json(request);
  } catch (error) {
    console.error("Error updating sell car status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating sell request",
    });
  }
};

export const deleteSellCarRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await SellCar.findById(id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    await request.deleteOne();
    res.status(200).json({
      success: true,
      message: "Sell car request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sell car request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
