import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

import {
    tenantTest,
} from "../controllers/tenantController.js";

const router = express.Router();


// ==========================================
// Tenant Test Route
// ==========================================

router.get(
    "/test",
    authMiddleware,
    tenantMiddleware,
    tenantTest
);

export default router;