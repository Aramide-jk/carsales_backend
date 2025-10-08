// routes/carRoutes.ts
import express from "express";
import { getSoldCars } from "../controllers/soldCarsController";

const router = express.Router();

// GET /api/cars/sold
router.get("/sold", getSoldCars);

export default router;
