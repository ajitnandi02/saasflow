import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// ===============================
// VIEW USERS
// Owner + Admin + Member
// ===============================

router.get(
    "/",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin", "member"),
    getUsers
);

router.get(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin", "member"),
    getUser
);

// ===============================
// MANAGE USERS
// Owner + Admin only
// ===============================

router.post(
    "/",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    createUser
);

router.put(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    tenantMiddleware,
    roleMiddleware("owner", "admin"),
    deleteUser
);

export default router;