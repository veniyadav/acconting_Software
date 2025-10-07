// src/routes/invoiceRoutes.js
import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

// CRUD Routes for Invoices
router.post("/", createInvoice);           // Create new invoice
router.get("/", getAllInvoices);           // Get all invoices
router.get("/:id", getInvoiceById);        // Get single invoice by ID
router.put("/:id", updateInvoice);         // Update invoice
router.delete("/:id", deleteInvoice);      // Delete invoice

export default router;