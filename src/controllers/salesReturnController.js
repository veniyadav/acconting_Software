// controllers/salesReturnController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all sales returns
const getAllSalesReturns = async (req, res) => {
  try {
    const salesReturns = await prisma.sales_returns.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(salesReturns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single sales return by ID
const getSalesReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesReturn = await prisma.sales_returns.findUnique({
      where: { id: BigInt(id) },
    });

    if (!salesReturn) {
      return res.status(404).json({ error: 'Sales return not found' });
    }

    res.json(salesReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new sales return
const createSalesReturn = async (req, res) => {
  try {
    const data = req.body;

    // Required fields
    if (!data.company_id || !data.return_date || !data.return_type || !data.reason_for_return) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, return_date, return_type, reason_for_return',
      });
    }

    const newSalesReturn = await prisma.sales_returns.create({
      data: {
        company_id: BigInt(data.company_id),
        reference_id: data.reference_id || undefined,
        manual_voucher_no: data.manual_voucher_no || undefined,
        auto_voucher_no: data.auto_voucher_no || undefined,
        return_no: data.return_no || undefined,
        invoice_id: data.invoice_id ? BigInt(data.invoice_id) : undefined,
        customer_id: data.customer_id ? BigInt(data.customer_id) : undefined,
        warehouse_id: data.warehouse_id ? BigInt(data.warehouse_id) : undefined,
        return_date: new Date(data.return_date),
        return_type: data.return_type,
        reason_for_return: data.reason_for_return,
        total_items: data.total_items !== undefined ? parseInt(data.total_items) : undefined,
        total_value: data.total_value !== undefined ? parseFloat(data.total_value) : undefined,
        status: data.status || 'Draft',
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : new Date(),
      },
    });

    res.status(201).json(newSalesReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update sales return
const updateSalesReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedSalesReturn = await prisma.sales_returns.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        reference_id: data.reference_id !== undefined ? data.reference_id : undefined,
        manual_voucher_no: data.manual_voucher_no !== undefined ? data.manual_voucher_no : undefined,
        auto_voucher_no: data.auto_voucher_no !== undefined ? data.auto_voucher_no : undefined,
        return_no: data.return_no !== undefined ? data.return_no : undefined,
        invoice_id: data.invoice_id !== undefined ? BigInt(data.invoice_id) : undefined,
        customer_id: data.customer_id !== undefined ? BigInt(data.customer_id) : undefined,
        warehouse_id: data.warehouse_id !== undefined ? BigInt(data.warehouse_id) : undefined,
        return_date: data.return_date ? new Date(data.return_date) : undefined,
        return_type: data.return_type !== undefined ? data.return_type : undefined,
        reason_for_return: data.reason_for_return !== undefined ? data.reason_for_return : undefined,
        total_items: data.total_items !== undefined ? parseInt(data.total_items) : undefined,
        total_value: data.total_value !== undefined ? parseFloat(data.total_value) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedSalesReturn);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sales return not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete sales return
const deleteSalesReturn = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sales_returns.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Sales return deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sales return not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllSalesReturns,
  getSalesReturnById,
  createSalesReturn,
  updateSalesReturn,
  deleteSalesReturn,
};