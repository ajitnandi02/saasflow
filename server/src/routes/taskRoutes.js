import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// GET ALL TASKS
// Owner + Admin + Member
router.get(
    "/",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin", "member"),
    getTasks
);

// GET SINGLE TASK
// Owner + Admin + Member
router.get(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin", "member"),
    getTask
);

// CREATE TASK
// Owner + Admin
router.post(
    "/",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    createTask
);

// UPDATE TASK
// Owner + Admin
router.put(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    updateTask
);

// DELETE TASK
// Owner only
router.delete(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner"),
    deleteTask
);

export default router;