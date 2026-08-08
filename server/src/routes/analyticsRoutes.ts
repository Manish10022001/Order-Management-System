import express from "express";
import {
  getOrdersPerDay,
  getRevenuePerStore,
} from "../controllers/analyticsController";

const router = express.Router();

router.get("/orders-per-day", getOrdersPerDay);
router.get("/revenue-per-store", getRevenuePerStore);

export default router;
