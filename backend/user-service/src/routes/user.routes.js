import express from "express";
import { updateResidency } from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
const router = express.Router();
router.patch(
  "/residency",
  authenticateUser,
  updateResidency
);

export default router;