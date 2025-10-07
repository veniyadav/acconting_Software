// controllers/voucherController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await prisma.vouchers.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await prisma.vouchers.findUnique({
      where: { id: BigInt(id) },
    });

    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    res.json(voucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVoucher = async (req, res) => {
  try {
    const data = req.body;

    const newVoucher = await prisma.vouchers.create({
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        voucher_type: data.voucher_type || undefined,
        company_name: data.company_name || null,
        company_logo: data.company_logo || null,
        from_customer_id: data.from_customer_id ? BigInt(data.from_customer_id) : undefined,
        to_name: data.to_name || null,
        receipt_number: data.receipt_number || null,
        voucher_number: data.voucher_number || null,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : null,
        subtotal: data.subtotal !== undefined ? parseFloat(data.subtotal) : null,
        total: data.total !== undefined ? parseFloat(data.total) : null,
        notes: data.notes || null,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: new Date(data.created_at) || new Date(),
      },
    });

    res.status(201).json(newVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedVoucher = await prisma.vouchers.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        voucher_type: data.voucher_type !== undefined ? data.voucher_type : undefined,
        company_name: data.company_name !== undefined ? data.company_name : undefined,
        company_logo: data.company_logo !== undefined ? data.company_logo : undefined,
        from_customer_id: data.from_customer_id ? BigInt(data.from_customer_id) : undefined,
        to_name: data.to_name !== undefined ? data.to_name : undefined,
        receipt_number: data.receipt_number !== undefined ? data.receipt_number : undefined,
        voucher_number: data.voucher_number !== undefined ? data.voucher_number : undefined,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : undefined,
        subtotal: data.subtotal !== undefined ? parseFloat(data.subtotal) : undefined,
        total: data.total !== undefined ? parseFloat(data.total) : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedVoucher);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vouchers.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};