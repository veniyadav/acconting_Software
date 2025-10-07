// controllers/expenseVoucherController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all expense vouchers
const getAllExpenseVouchers = async (req, res) => {
  try {
    const expenseVouchers = await prisma.expense_vouchers.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(expenseVouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single expense voucher by ID
const getExpenseVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const expenseVoucher = await prisma.expense_vouchers.findUnique({
      where: { id: BigInt(id) },
    });

    if (!expenseVoucher) {
      return res.status(404).json({ error: 'Expense voucher not found' });
    }

    res.json(expenseVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new expense voucher
const createExpenseVoucher = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.company_id || !data.voucher_date || !data.paid_from || !data.total_amount) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, voucher_date, paid_from, total_amount',
      });
    }

    const newExpenseVoucher = await prisma.expense_vouchers.create({
      data: {
        company_id: BigInt(data.company_id),
        auto_receipt_no: data.auto_receipt_no || undefined,
        manual_receipt_no: data.manual_receipt_no || undefined,
        voucher_date: new Date(data.voucher_date),
        paid_from: data.paid_from,
        paid_to_account_id: data.paid_to_account_id ? BigInt(data.paid_to_account_id) : undefined,
        total_amount: parseFloat(data.total_amount),
        voucher_narration: data.voucher_narration || '',
        status: data.status || 'Draft',
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : new Date(),
      },
    });

    res.status(201).json(newExpenseVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update expense voucher
const updateExpenseVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedExpenseVoucher = await prisma.expense_vouchers.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        auto_receipt_no: data.auto_receipt_no !== undefined ? data.auto_receipt_no : undefined,
        manual_receipt_no: data.manual_receipt_no !== undefined ? data.manual_receipt_no : undefined,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : undefined,
        paid_from: data.paid_from !== undefined ? data.paid_from : undefined,
        paid_to_account_id: data.paid_to_account_id !== undefined ? BigInt(data.paid_to_account_id) : undefined,
        total_amount: data.total_amount !== undefined ? parseFloat(data.total_amount) : undefined,
        voucher_narration: data.voucher_narration !== undefined ? data.voucher_narration : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedExpenseVoucher);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Expense voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete expense voucher
const deleteExpenseVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.expense_vouchers.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Expense voucher deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Expense voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllExpenseVouchers,
  getExpenseVoucherById,
  createExpenseVoucher,
  updateExpenseVoucher,
  deleteExpenseVoucher,
};