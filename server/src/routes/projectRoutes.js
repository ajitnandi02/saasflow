import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// GET ALL PROJECTS
// Owner + Admin + Member
router.get(
    "/",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin", "member"),
    getProjects
);

// GET SINGLE PROJECT
// Owner + Admin + Member
router.get(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin", "member"),
    getProject
);

// CREATE PROJECT
// Owner + Admin
router.post(
    "/",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    createProject
);

// UPDATE PROJECT
// Owner + Admin
router.put(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    updateProject
);

// DELETE PROJECT
// Owner only
router.delete(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner"),
    deleteProject
);

export default router;