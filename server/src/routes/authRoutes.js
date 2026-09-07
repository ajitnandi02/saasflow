import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// =============================
// PUBLIC ROUTES
// =============================

// Register
router.post("/register", register);

// Login
router.post("/login", login);


// =============================
// PROTECTED ROUTES
// =============================

// Get logged-in user
router.get("/me", authMiddleware, getMe);


export default router;