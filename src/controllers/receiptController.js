// src/controllers/receiptController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Create Receipt
export const createReceipt = async (req, res) => {
  try {
    const {
      company_id,
      receipt_no_auto,
      receipt_no_manual,
      voucher_date,
      received_into,
      received_from,
      upload_document,
      receipt_type,
      narration,
      sub_total,
      total_amount,
      created_by,
    } = req.body;

    const newReceipt = await prisma.received_from_customer.create({
      data: {
        company_id: BigInt(company_id),
        receipt_no_auto,
        receipt_no_manual,
        voucher_date: new Date(voucher_date),
        received_into,
        received_from,
        upload_document,
        receipt_type,
        narration,
        sub_total: parseFloat(sub_total),
        total_amount: parseFloat(total_amount),
        created_by: BigInt(created_by),
      },
    });

    res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      data: newReceipt,
    });
  } catch (error) {
    console.error("Error creating receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create receipt",
      error: error.message,
    });
  }
};

// ✅ Get All Receipts
export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await prisma. received_from_customer.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipts",
      error: error.message,
    });
  }
};

// ✅ Get Receipt by ID
export const getReceiptById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const receipt = await prisma.receipt.findUnique({
      where: { id },
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipt",
      error: error.message,
    });
  }
};

// ✅ Update Receipt
export const updateReceipt = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const {
      company_id,
      receipt_no_auto,
      receipt_no_manual,
      voucher_date,
      received_into,
      received_from,
      upload_document,
      receipt_type,
      narration,
      sub_total,
      total_amount,
      created_by,
    } = req.body;

    const updatedReceipt = await prisma.received_from_customer.update({
      where: { id },
      data: {
        company_id: company_id ? BigInt(company_id) : undefined,
        receipt_no_auto,
        receipt_no_manual,
        voucher_date: voucher_date ? new Date(voucher_date) : undefined,
        received_into,
        received_from,
        upload_document,
        receipt_type,
        narration,
        sub_total: sub_total ? parseFloat(sub_total) : undefined,
        total_amount: total_amount ? parseFloat(total_amount) : undefined,
        created_by: created_by ? BigInt(created_by) : undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: "Receipt updated successfully",
      data: updatedReceipt,
    });
  } catch (error) {
    console.error("Error updating receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update receipt",
      error: error.message,
    });
  }
};

// ✅ Delete Receipt
export const deleteReceipt = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.receipt.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Receipt deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete receipt",
      error: error.message,
    });
  }
};