// controllers/vendorPaymentController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all vendor payments
const getAllVendorPayments = async (req, res) => {
  try {
    const payments = await prisma.vendor_payments.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single vendor payment by ID
const getVendorPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.vendor_payments.findUnique({
      where: { id: BigInt(id) },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Vendor payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new vendor payment
const createVendorPayment = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.company_id || !data.auto_payment_no || !data.voucher_date || data.sub_total === undefined || data.total_amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPayment = await prisma.vendor_payments.create({
      data: {
        company_id: BigInt(data.company_id),
        auto_payment_no: data.auto_payment_no,
        manual_payment_no: data.manual_payment_no || undefined,
        voucher_date: new Date(data.voucher_date),
        paid_from: data.paid_from,
        paid_to_id: BigInt(data.paid_to_id),
        upload_document: data.upload_document ? JSON.parse(data.upload_document) : [],
        payment_mode: data.payment_mode,
        sub_total: parseFloat(data.sub_total),
        total_amount: parseFloat(data.total_amount),
        narration: data.narration || '',
        status: data.status || 'draft',
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: new Date(data.created_at) || new Date(),
      },
    });

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update vendor payment
const updateVendorPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedPayment = await prisma.vendor_payments.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        auto_payment_no: data.auto_payment_no !== undefined ? data.auto_payment_no : undefined,
        manual_payment_no: data.manual_payment_no !== undefined ? data.manual_payment_no : undefined,
        voucher_date: data.voucher_date ? new Date(data.voucher_date) : undefined,
        paid_from: data.paid_from !== undefined ? data.paid_from : undefined,
        paid_to_id: data.paid_to_id !== undefined ? BigInt(data.paid_to_id) : undefined,
        upload_document: data.upload_document !== undefined ? JSON.parse(data.upload_document) : undefined,
        payment_mode: data.payment_mode !== undefined ? data.payment_mode : undefined,
        sub_total: data.sub_total !== undefined ? parseFloat(data.sub_total) : undefined,
        total_amount: data.total_amount !== undefined ? parseFloat(data.total_amount) : undefined,
        narration: data.narration !== undefined ? data.narration : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedPayment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Vendor payment not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete vendor payment
const deleteVendorPayment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vendor_payments.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Vendor payment deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Vendor payment not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllVendorPayments,
  getVendorPaymentById,
  createVendorPayment,
  updateVendorPayment,
  deleteVendorPayment,
};