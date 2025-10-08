"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error("💥 Error: %s", err.message, { stack: err.stack });
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};
exports.errorHandler = errorHandler;
