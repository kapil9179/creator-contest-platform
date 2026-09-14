import express from "express";

import { fetchRankings } from "../../controllers/ranking/ranking.controllers.js";

const router = express.Router();

router.get("/", fetchRankings);

export default router;









