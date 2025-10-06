//dipanshu patidar
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCompanyId, // Import the new function
} from "../controllers/productController.js";

const router = express.Router();

// CRUD routes
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/company/:companyId", getProductsByCompanyId); // Add this new route
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;