import express from "express";

import {
  requestKyc,
  passKyc,
  failKyc,
} from "../../controllers/kyc/kyc.controller.js";

const router = express.Router();

router.patch(
  "/:winnerId/request",
  requestKyc
);

router.patch(
  "/:winnerId/pass",
  passKyc
);

router.patch(
  "/:winnerId/fail",
  failKyc
);

export default router;