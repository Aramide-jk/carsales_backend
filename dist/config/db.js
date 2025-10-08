"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async (mongoUri) => {
    try {
        const conn = await mongoose_1.default.connect(mongoUri);
        logger_1.default.info(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_1.default.error("MongoDB connection failed: %s", error.message, {
            stack: error.stack,
        });
        process.exit(1);
    }
};
exports.default = connectDB;
// import mongoose from "mongoose";
// const connectDB = async (mongoUri: string) => {
//   try {
//     const conn = await mongoose.connect(mongoUri);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error: any) {
//     console.error(" MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };
// export default connectDB;
