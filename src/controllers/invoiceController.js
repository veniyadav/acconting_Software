// src/controllers/invoiceController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: BigInt को सुरक्षित रूप से string में बदलें
const serializeBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

// ✅ Create an invoice
export const createInvoice = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Validate status (must be one of: "Paid", "Unpaid", "Partial", "Overdue")
    let status = data.status;
    if (!status || !['Paid', 'Unpaid', 'Partial', 'Overdue'].includes(status)) {
      status = 'Unpaid'; // default fallback
    }

    // ✅ Validate payment_status (must be: "Paid", "Unpaid", "Partial")
    let payment_status = data.payment_status;
    if (!payment_status || !['Paid', 'Unpaid', 'Partial'].includes(payment_status)) {
      payment_status = 'Unpaid';
    }

    // ✅ Validate payment_method (optional, but must match enum if provided)
    const validPaymentMethods = ['Cash', 'Card', 'BankTransfer', 'Online', 'Other'];
    let payment_method = data.payment_method;
    if (payment_method && !validPaymentMethods.includes(payment_method)) {
      payment_method = null;
    }

    const newInvoice = await prisma.invoices.create({
      data: {
        invoice_no: data.invoice_no,
        reference_no: data.reference_no,
        customer_id: data.customer_id ? BigInt(data.customer_id) : null,
        gross_amount: data.gross_amount ? parseFloat(data.gross_amount) : 0,
        invoice_date: data.invoice_date ? new Date(data.invoice_date) : new Date(),
        due_date: data.due_date ? new Date(data.due_date) : null,
        terms: data.terms,
        status: status,
        payment_status: payment_status,
        payment_method: payment_method,
        notes: data.notes,
      },
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: serializeBigInt(newInvoice),
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

// ✅ Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoices.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json({
      success: true,
      data: serializeBigInt(invoices),
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

// ✅ Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const invoice = await prisma.invoices.findUnique({
      where: { id },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: serializeBigInt(invoice),
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

// ✅ Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;

    // Same validation as create
    let status = data.status;
    if (status && !['Paid', 'Unpaid', 'Partial', 'Overdue'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    let payment_status = data.payment_status;
    if (payment_status && !['Paid', 'Unpaid', 'Partial'].includes(payment_status)) {
      return res.status(400).json({ success: false, message: "Invalid payment_status value" });
    }

    const validPaymentMethods = ['Cash', 'Card', 'BankTransfer', 'Online', 'Other'];
    let payment_method = data.payment_method;
    if (payment_method && !validPaymentMethods.includes(payment_method)) {
      return res.status(400).json({ success: false, message: "Invalid payment_method value" });
    }

    const updatedInvoice = await prisma.invoices.update({
      where: { id },
      data: {
        invoice_no: data.invoice_no,
        reference_no: data.reference_no,
        customer_id: data.customer_id ? BigInt(data.customer_id) : undefined,
        gross_amount: data.gross_amount ? parseFloat(data.gross_amount) : undefined,
        invoice_date: data.invoice_date ? new Date(data.invoice_date) : undefined,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        terms: data.terms,
        status: status,
        payment_status: payment_status,
        payment_method: payment_method,
        notes: data.notes,
      },
    });

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: serializeBigInt(updatedInvoice),
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update invoice",
      error: error.message,
    });
  }
};

// ✅ Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.invoices.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
      error: error.message,
    });
  }
};