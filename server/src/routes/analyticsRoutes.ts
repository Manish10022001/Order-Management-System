import express from "express";
import {
  getOrdersPerDay,
  getRevenuePerStore,
  getTopSellingItems,
} from "../controllers/analyticsController";

const router = express.Router();

router.get("/orders-per-day", getOrdersPerDay);
router.get("/revenue-per-store", getRevenuePerStore);
router.get("/top-selling-items", getTopSellingItems);

export default router;
