"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarById = exports.getAllCars = exports.deleteCar = exports.updateCar = exports.create = void 0;
const CarModel_1 = __importDefault(require("../models/CarModel"));
const logger_1 = __importDefault(require("../config/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const create = async (req, res) => {
    try {
        const { brand, model, year, price, description, fuelType, mileage, transmission, condition = "local used", engine, status = "available", location, } = req.body;
        let features = req.body.features;
        if (typeof features === "string") {
            try {
                features = JSON.parse(features);
            }
            catch {
                features = features.split(",").map((item) => item.trim());
            }
        }
        else if (!Array.isArray(features)) {
            features = [];
        }
        let uploadedUrls = [];
        const files = req.files;
        if (files && files.length > 0) {
            if (files.length > 20) {
                return res
                    .status(400)
                    .json({ message: "You can upload up to 20 images only" });
            }
            uploadedUrls = files.map((file) => file.path);
        }
        else if (req.body.images && Array.isArray(req.body.images)) {
            // Optional: Accept existing Cloudinary URLs from body
            uploadedUrls = req.body.images;
        }
        if (!uploadedUrls || uploadedUrls.length === 0) {
            return res
                .status(400)
                .json({ message: "At least one image is required" });
        }
        const car = await CarModel_1.default.create({
            brand,
            model,
            year,
            price,
            description,
            fuelType,
            mileage,
            transmission,
            condition,
            engine,
            features,
            status,
            location,
            images: uploadedUrls,
            createdBy: req.user?._id,
        });
        logger_1.default.info("Car created: %s %s", car.brand, car.model);
        res.status(201).json(car);
    }
    catch (error) {
        logger_1.default.error("Failed to create car: %s", error.message, {
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to create car",
            error: error.message,
        });
    }
};
exports.create = create;
// export const updateCar = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const car = await Car.findById(req.params.id);
//     if (!car) {
//       res.status(404).json({ success: false, message: "Car not found" });
//       return;
//     }
//     Object.assign(car, req.body);
//     const updatedCar = await car.save();
//     res.status(200).json({ success: true, data: updatedCar });
//   } catch (error: any) {
//     logger.error("Error updating car: %s", error.message, {
//       stack: error.stack,
//     });
//     res
//       .status(500)
//       .json({ success: false, message: "Server error while updating car" });
//   }
// };
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        // Build update object
        const updateData = { ...req.body };
        // Handle uploaded image (if any)
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        // Ensure year and price are numbers (FormData sends as strings)
        if (updateData.year)
            updateData.year = Number(updateData.year);
        if (updateData.price)
            updateData.price = Number(updateData.price);
        const updatedCar = await CarModel_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedCar) {
            return res.status(404).json({ message: "Car not found" });
        }
        return res.status(200).json(updatedCar);
    }
    catch (error) {
        console.error("Error updating car:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateCar = updateCar;
const deleteCar = async (req, res) => {
    try {
        const car = await CarModel_1.default.findById(req.params.id);
        if (!car) {
            res.status(404).json({ success: false, message: "Car not found" });
            return;
        }
        await car.deleteOne();
        res
            .status(200)
            .json({ success: true, message: "Car removed successfully" });
    }
    catch (error) {
        logger_1.default.error("Error deleting car: %s", error.message, {
            stack: error.stack,
        });
        res
            .status(500)
            .json({ success: false, message: "Server error while deleting car" });
    }
};
exports.deleteCar = deleteCar;
const getAllCars = async (req, res) => {
    try {
        const cars = await CarModel_1.default.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        // res.json(cars);
        res.status(200).json({ success: true, count: cars.length, data: cars });
    }
    catch (error) {
        logger_1.default.error("Error fetching cars: %s", error.message, {
            stack: error.stack,
        });
        res
            .status(500)
            .json({ success: false, message: "Server error while fetching cars" });
    }
};
exports.getAllCars = getAllCars;
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid car ID format" });
            return;
        }
        const car = await CarModel_1.default.findById(id);
        if (!car) {
            res.status(404).json({ success: false, message: "Car not found" });
            return;
        }
        res.status(200).json({ success: true, data: car });
    }
    catch (error) {
        logger_1.default.error("Error fetching car: %s", error.message, {
            stack: error.stack,
        });
        res
            .status(500)
            .json({ success: false, message: "Server error while fetching car" });
    }
};
exports.getCarById = getCarById;
