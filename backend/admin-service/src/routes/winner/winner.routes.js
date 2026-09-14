import express from "express";

import {
  generateWinners,
  getWinners,
} from "../../controllers/winner/winner.controller.js";

const router = express.Router();

router.post(
  "/generate",
  generateWinners
);

router.get(
  "/",
  getWinners
);

export default router;