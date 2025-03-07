import express from "express";
import { getDashboardData } from "../controller/dashboard.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.route("/get-dashboard-data").get(protect, getDashboardData);

export default router;

