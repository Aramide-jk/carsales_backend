"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const inspectionRoute_1 = __importDefault(require("./routes/inspectionRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const sellCarRequestRoutes_1 = __importDefault(require("./routes/sellCarRequestRoutes"));
const sendEmailRoute_1 = __importDefault(require("./routes/sendEmailRoute"));
const carRoute_1 = __importDefault(require("./routes/carRoute"));
const soldCarsRoute_1 = __importDefault(require("./routes/soldCarsRoute"));
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = NODE_ENV === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;
const DB_URL = NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.LOCAL_MONGO_URI;
const FRONTEND_URL = NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : process.env.FRONTEND_URL_LOCAL;
console.log("=================================");
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`PORT: ${PORT}`);
console.log(`DB_URL: ${DB_URL}`);
console.log(`FRONTEND_URL: ${FRONTEND_URL}`);
console.log("=================================");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
if (NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
// CORS
const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_VITE,
    process.env.FRONTEND_URL,
].filter((origin) => !!origin);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoute_1.default);
app.use("/api/inspections", inspectionRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
app.use("/api/", carRoute_1.default);
app.use("/api/", soldCarsRoute_1.default);
app.use("/api/sell-requests", sellCarRequestRoutes_1.default);
app.use("/api/email", sendEmailRoute_1.default);
// --------------------
// Error handlers
// --------------------
// app.use(errorHandler);
// --------------------
// Connect to DB & Start Server
// --------------------
if (!DB_URL) {
    console.error("Error: Database connection string is not defined.");
    process.exit(1);
}
(0, db_1.default)(DB_URL)
    .then(() => {
    if (NODE_ENV !== "test") {
        app.listen(PORT, () => {
            console.log(` Server running in ${NODE_ENV} mode on port ${PORT}`);
        });
    }
})
    .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
exports.default = app;
