import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

// Routes
import authRoutes from "./routes/authRoute";
import inspectionRoutes from "./routes/inspectionRoute";
import adminRoutes from "./routes/adminRoute";
import sellRoutes from "./routes/sellCarRequestRoutes";
import sendEmailRoutes from "./routes/sendEmailRoute";
import carRoute from "./routes/carRoute";
import soldRoutes from "./routes/soldCarsRoute";
// import { errorHandler } from "./middleware/errorMiddleware";

// --------------------
// Environment setup
// --------------------
const NODE_ENV = process.env.NODE_ENV || "development";

// process.env.PORT || process.env.PROD_PORT || process.env.DEV_PORT || 5000;
const PORT = process.env.PORT || 5000;

// const PORT =
//   process.env.PORT ||
//   (NODE_ENV === "production"
//     ? process.env.PROD_PORT && process.env.FRONTEND_URL_PRO
//     : process.env.DEV_PORT);

const DB_URL =
  NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.LOCAL_MONGO_URI;

const FRONTEND_URL =
  NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : process.env.FRONTEND_URL_LOCAL;

console.log("=================================");
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`PORT: ${PORT}`);
console.log(`DB_URL: ${DB_URL}`);
console.log(`FRONTEND_URL: ${FRONTEND_URL}`);
console.log("=================================");

const app: Application = express();

// --------------------
// Middlewares
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
if (NODE_ENV === "development") app.use(morgan("dev"));

// --------------------
// CORS setup
// --------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PRO,
  process.env.FRONTEND_URL_LOCAL,
  process.env.FRONTEND_URL_VITE,
].filter((origin): origin is string => !!origin);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// --------------------
// Health check route (important for Railway)
// --------------------
app.get("/", (req, res) => {
  res.send("CarSales Backend is running successfully!");
});

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", carRoute);
app.use("/api", soldRoutes);
app.use("/api/sell-requests", sellRoutes);
app.use("/api/email", sendEmailRoutes);

if (!DB_URL) {
  console.error("Error: Database connection string is not defined.");
  process.exit(1);
}

connectDB(DB_URL)
  .then(() => {
    if (NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

export default app;

// import dotenv from "dotenv";
// dotenv.config();
// import express, { Application } from "express";
// import cors from "cors";
// import morgan from "morgan";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import connectDB from "./config/db";
// import authRoutes from "./routes/authRoute";
// import inspectionRoutes from "./routes/inspectionRoute";
// import adminRoutes from "./routes/adminRoute";
// import sellRoutes from "./routes/sellCarRequestRoutes";
// import sendEmailRoutes from "./routes/sendEmailRoute";
// import carRoute from "./routes/carRoute";
// import soldRoutes from "./routes/soldCarsRoute";
// // import { errorHandler } from "./middleware/errorMiddleware";

// const NODE_ENV = process.env.NODE_ENV || "development";
// const PORT =
//   NODE_ENV === "production" ? process.env.PROD_PORT : process.env.DEV_PORT;
// const DB_URL =
//   NODE_ENV === "production"
//     ? process.env.MONGO_URI
//     : process.env.LOCAL_MONGO_URI;

// const FRONTEND_URL =
//   NODE_ENV === "production"
//     ? process.env.FRONTEND_URL
//     : process.env.FRONTEND_URL_LOCAL;

// console.log("=================================");
// console.log(`NODE_ENV: ${NODE_ENV}`);
// console.log(`PORT: ${PORT}`);
// console.log(`DB_URL: ${DB_URL}`);
// console.log(`FRONTEND_URL: ${FRONTEND_URL}`);
// console.log("=================================");

// const app: Application = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(helmet());
// if (NODE_ENV === "development") app.use(morgan("dev"));

// // CORS
// const allowedOrigins = [
//   process.env.FRONTEND_URL_LOCAL,
//   process.env.FRONTEND_URL_VITE,
//   process.env.FRONTEND_URL,
// ].filter((origin): origin is string => !!origin);
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// // --------------------
// // Routes
// // --------------------
// app.use("/api/auth", authRoutes);
// app.use("/api/inspections", inspectionRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/", carRoute);
// app.use("/api/", soldRoutes);
// app.use("/api/sell-requests", sellRoutes);
// app.use("/api/email", sendEmailRoutes);

// // --------------------
// // Error handlers
// // --------------------
// // app.use(errorHandler);

// // --------------------
// // Connect to DB & Start Server
// // --------------------
// if (!DB_URL) {
//   console.error("Error: Database connection string is not defined.");
//   process.exit(1);
// }

// connectDB(DB_URL)
//   .then(() => {
//     if (NODE_ENV !== "test") {
//       app.listen(PORT, () => {
//         console.log(` Server running in ${NODE_ENV} mode on port ${PORT}`);
//       });
//     }
//   })
//   .catch((err) => {
//     console.error("Failed to start server:", err);
//     process.exit(1);
//   });

// export default app;
