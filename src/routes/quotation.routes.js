import express from "express";
import {
  getQuotations,
  createQuotation,
} from "../controllers/quotation.controller.js";

const router = express.Router();

// GET all quotations
router.get("/", getQuotations);

// POST new quotation
router.post("/", createQuotation);

export default router;
