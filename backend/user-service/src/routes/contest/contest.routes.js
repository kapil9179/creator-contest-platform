import express from "express";
import { getContestData } from "../../controllers/contest/contest.controller.js";

const router = express.Router();

router.get(
  "/data",
  getContestData
);

export default router;