// src/routes/warehouse.routes.js
import express from "express";
import {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} from "../controllers/warehouses.controller.js";

const router = express.Router();

router.post("/", createWarehouse);
router.get("/", getAllWarehouses);
router.get("/:id", getWarehouseById);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);

export default router;
