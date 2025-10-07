// controllers/contraVoucherController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllContraVouchers = async (req, res) => {
  try {
    const contraVouchers = await prisma.contra_vouchers.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(contraVouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContraVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const contraVoucher = await prisma.contra_vouchers.findUnique({
      where: { id: BigInt(id) },
    });

    if (!contraVoucher) {
      return res.status(404).json({ error: 'Contra voucher not found' });
    }

    res.json(contraVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createContraVoucher = async (req, res) => {
  try {
    const data = req.body;

    const newContraVoucher = await prisma.contra_vouchers.create({
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        auto_voucher_no: data.auto_voucher_no || null,
        manual_voucher_no: data.manual_voucher_no || null,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : null,
        account_from_id: data.account_from_id ? BigInt(data.account_from_id) : undefined,
        account_to_id: data.account_to_id ? BigInt(data.account_to_id) : undefined,
        amount: data.amount !== undefined ? parseFloat(data.amount) : null,
        upload_document: data.upload_document || null,
        narration: data.narration || null,
        status: data.status || 'Draft', // Default to Draft if not provided
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: new Date(data.created_at) || new Date(),
      },
    });

    res.status(201).json(newContraVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContraVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedContraVoucher = await prisma.contra_vouchers.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        auto_voucher_no: data.auto_voucher_no !== undefined ? data.auto_voucher_no : undefined,
        manual_voucher_no: data.manual_voucher_no !== undefined ? data.manual_voucher_no : undefined,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : undefined,
        account_from_id: data.account_from_id ? BigInt(data.account_from_id) : undefined,
        account_to_id: data.account_to_id ? BigInt(data.account_to_id) : undefined,
        amount: data.amount !== undefined ? parseFloat(data.amount) : undefined,
        upload_document: data.upload_document !== undefined ? data.upload_document : undefined,
        narration: data.narration !== undefined ? data.narration : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedContraVoucher);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contra voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteContraVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contra_vouchers.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Contra voucher deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contra voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllContraVouchers,
  getContraVoucherById,
  createContraVoucher,
  updateContraVoucher,
  deleteContraVoucher,
};