// controllers/incomeVoucherController.js


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllIncomeVouchers = async (req, res) => {
  try {
    const incomeVouchers = await prisma.income_vouchers.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(incomeVouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getIncomeVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const incomeVoucher = await prisma.income_vouchers.findUnique({
      where: { id: BigInt(id) },
    });

    if (!incomeVoucher) {
      return res.status(404).json({ error: 'Income voucher not found' });
    }

    res.json(incomeVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createIncomeVoucher = async (req, res) => {
  try {
    const data = req.body;

    const newIncomeVoucher = await prisma.income_vouchers.create({
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        auto_receipt_no: data.auto_receipt_no || null,
        manual_receipt_no: data.manual_receipt_no || null,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : null,
        deposited_to: data.deposited_to || null,
        received_from_id: data.received_from_id ? BigInt(data.received_from_id) : undefined,
        total_amount: data.total_amount !== undefined ? parseFloat(data.total_amount) : null,
        voucher_narration: data.voucher_narration || null,
        status: data.status || 'Draft', // Default to Draft if not provided
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: new Date(data.created_at) || new Date(),
      },
    });

    res.status(201).json(newIncomeVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIncomeVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedIncomeVoucher = await prisma.income_vouchers.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        auto_receipt_no: data.auto_receipt_no !== undefined ? data.auto_receipt_no : undefined,
        manual_receipt_no: data.manual_receipt_no !== undefined ? data.manual_receipt_no : undefined,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : undefined,
        deposited_to: data.deposited_to !== undefined ? data.deposited_to : undefined,
        received_from_id: data.received_from_id ? BigInt(data.received_from_id) : undefined,
        total_amount: data.total_amount !== undefined ? parseFloat(data.total_amount) : undefined,
        voucher_narration: data.voucher_narration !== undefined ? data.voucher_narration : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedIncomeVoucher);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Income voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteIncomeVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.income_vouchers.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Income voucher deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Income voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllIncomeVouchers,
  getIncomeVoucherById,
  createIncomeVoucher,
  updateIncomeVoucher,
  deleteIncomeVoucher,
};