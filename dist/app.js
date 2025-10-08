"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const inspectionRoute_1 = __importDefault(require("./routes/inspectionRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)()); // secure HTTP headers
app.use((0, morgan_1.default)("dev")); // request logger
// CORS
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // React local dev
        "http://localhost:5174", // Vite local dev
        "https://jkautoss.netlify.app" // production frontend
    ],
    credentials: true,
}));
// Routes
app.use("/api/auth", authRoute_1.default);
app.use("/api/inspections", inspectionRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
// Error handling
app.use(errorMiddleware_1.errorHandler);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
