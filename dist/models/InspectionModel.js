"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const inspectionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    car: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Inspection", inspectionSchema);
// import { Schema, model, Document } from "mongoose";
// export interface InspectionDocument {
//   user: Schema.Types.ObjectId;
//   car: Schema.Types.ObjectId;
//   date: Date;
//   location: string;
//   phone: string;
//   brand: string;
//   model: string;
//   notes?: string;
//   status: "pending" | "confirmed" | "completed" | "cancelled";
// }
// const inspectionSchema = new Schema<InspectionDocument>(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     car: {
//       type: Schema.Types.ObjectId,
//       ref: "Car",
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     brand: {
//       type: String,
//       // required: true,
//     },
//     model: {
//       type: String,
//       // required: true
//     },
//     notes: {
//       type: String,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "completed", "cancelled"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );
// export default model<InspectionDocument>("Inspection", inspectionSchema);
