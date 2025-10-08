"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSellCarRequest = exports.updateSellCarStatus = exports.getRequests = exports.createRequest = void 0;
const SellCarRequestModel_1 = __importDefault(require("../models/SellCarRequestModel"));
const sendEmail_1 = require("../utils/sendEmail");
const createRequest = async (req, res) => {
    try {
        const { brand, model, year, mileage, engine, description, location, serviceHistory, modifications, reason, price, ownerName, ownerEmail, ownerPhone, } = req.body;
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized" });
        }
        const files = req.files;
        const interiorImages = files?.interiorImages?.map((file) => file.path) || [];
        const exteriorImages = files?.exteriorImages?.map((file) => file.path) || [];
        const idFront = files?.idFront?.[0]?.path;
        const idBack = files?.idBack?.[0]?.path;
        const carReg = files?.carReg?.[0]?.path;
        const customPaper = files?.customPaper?.[0]?.path;
        let features = [];
        if (typeof req.body.features === "string") {
            try {
                features = JSON.parse(req.body.features);
            }
            catch {
                features = req.body.features
                    .split(",")
                    .map((item) => item.trim());
            }
        }
        else if (Array.isArray(req.body.features)) {
            features = req.body.features;
        }
        const sellRequest = await SellCarRequestModel_1.default.create({
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
    }
    catch (error) {
        console.error("Error creating sell car request:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error while creating request",
        });
    }
};
exports.createRequest = createRequest;
const getRequests = async (req, res) => {
    try {
        const requests = await SellCarRequestModel_1.default.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    }
    catch (error) {
        console.error("Error fetching sell car requests:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getRequests = getRequests;
const updateSellCarStatus = async (req, res) => {
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
        const request = await SellCarRequestModel_1.default.findById(id).populate("user", "name email");
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
                await (0, sendEmail_1.sendEmail)(request.user.email, subject, message);
            }
            catch (mailError) {
                console.error("Email sending failed:", mailError);
            }
        }
        return res.status(200).json(request);
    }
    catch (error) {
        console.error("Error updating sell car status:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating sell request",
        });
    }
};
exports.updateSellCarStatus = updateSellCarStatus;
const deleteSellCarRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await SellCarRequestModel_1.default.findById(id);
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
    }
    catch (error) {
        console.error("Error deleting sell car request:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteSellCarRequest = deleteSellCarRequest;
