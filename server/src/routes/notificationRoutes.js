import express from "express";

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = express.Router();

// Get all notifications
router.get(
    "/",
    authMiddleware,
    tenantMiddleware,
    getNotifications
);

// Get unread notification count
router.get(
    "/unread-count",
    authMiddleware,
    tenantMiddleware,
    getUnreadCount
);

// Mark one notification as read
router.put(
    "/:id/read",
    authMiddleware,
    tenantMiddleware,
    markAsRead
);

// Mark all notifications as read
router.put(
    "/read-all",
    authMiddleware,
    tenantMiddleware,
    markAllAsRead
);

// Delete one notification
router.delete(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    deleteNotification
);

export default router;