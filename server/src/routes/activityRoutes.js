import express from "express";

import {
    getActivities,
    getRecentActivities,
    getActivityCount,
} from "../controllers/activityController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = express.Router();


// ==========================================
// GET ALL ACTIVITIES
// ==========================================

router.get(
    "/",
    authMiddleware,
    tenantMiddleware,
    getActivities
);


// ==========================================
// GET RECENT ACTIVITIES
// ==========================================

router.get(
    "/recent",
    authMiddleware,
    tenantMiddleware,
    getRecentActivities
);


// ==========================================
// GET ACTIVITY COUNT
// ==========================================

router.get(
    "/count",
    authMiddleware,
    tenantMiddleware,
    getActivityCount
);


export default router;