import express from "express";
import { archiveOldOrders } from "../controllers/archiveController";

const router = express.Router();

router.post("/", archiveOldOrders);

export default router;
