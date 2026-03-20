import express from "express";

import {
  addBilling,
  searchBilling,
  updateBilling,
  deleteBilling
} from "../controllers/billingController.js";

import {
  verifyToken
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/add",
  verifyToken,
  addBilling
);

router.get(
  "/search",
  searchBilling
);

router.put(
  "/update/:id",
  verifyToken,
  updateBilling
);

router.delete(
  "/delete/:id",
  verifyToken,
  deleteBilling
);

export default router;
