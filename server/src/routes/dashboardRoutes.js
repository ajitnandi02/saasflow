import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

import {
    getDashboardStats,
} from "../controllers/dashboardController.js";

const router = express.Router();

// GET DASHBOARD STATISTICS
router.get(
    "/stats",
    authMiddleware,
    tenantMiddleware,
    getDashboardStats
);

export default router;