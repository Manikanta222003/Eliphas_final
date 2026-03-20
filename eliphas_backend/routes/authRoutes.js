import express from "express";
import {
  login,
  initiateCreateUser,
  confirmCreateUser,
  getUsers,
  deleteUser,
  seedAdmin
} from "../controllers/authController.js";
import { verifyToken, adminOnly, adminOrManager } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// Public
// ─────────────────────────────────────────────
router.post("/login", login);
router.post("/seed",  seedAdmin);

// ─────────────────────────────────────────────
// Admin only — create user (2-step with OTP)
// ─────────────────────────────────────────────
router.post("/users/initiate", verifyToken, adminOnly, initiateCreateUser);
router.post("/users/confirm",  verifyToken, adminOnly, confirmCreateUser);

// ─────────────────────────────────────────────
// Admin + Manager — view users
// ─────────────────────────────────────────────
router.get("/users", verifyToken, adminOrManager, getUsers);

// ─────────────────────────────────────────────
// Delete — role permissions handled in controller
// ─────────────────────────────────────────────
router.delete("/users/:id", verifyToken, adminOrManager, deleteUser);

export default router;