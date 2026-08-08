import express from "express";
import { getOrdersPerDay } from "../controllers/analyticsController";

const router = express.Router();

router.get("/orders-per-day", getOrdersPerDay);

export default router;
