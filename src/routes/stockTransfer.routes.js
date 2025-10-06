//aman
import express from "express";
import {
  createStockTransfer,
  getAllStockTransfers,
  getStockTransferById,
  getStockTransfersByCompanyId,
  updateStockTransfer,
  deleteStockTransfer,
} from "../controllers/stockTransferController.js";

const router = express.Router();

// Order matters: specific routes before dynamic :id
router.get("/company/:company_id", getStockTransfersByCompanyId);
router.get("/:id", getStockTransferById);
router.get("/", getAllStockTransfers);
router.post("/", createStockTransfer);
router.put("/:id", updateStockTransfer);
router.delete("/:id", deleteStockTransfer);

export default router;
