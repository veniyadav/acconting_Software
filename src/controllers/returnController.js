// controllers/returnController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllReturns = async (req, res) => {
  try {
    const returns = await prisma.returns.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const returnRecord = await prisma.returns.findUnique({
      where: { id: BigInt(id) },
    });

    if (!returnRecord) {
      return res.status(404).json({ error: 'Return not found' });
    }

    res.json(returnRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReturn = async (req, res) => {
  try {
    const data = req.body;

    // Required fields per schema: return_no, invoice_no, return_date, return_type, warehouse_id, reason
    if (
      !data.return_no ||
      !data.invoice_no ||
      !data.return_date ||
      !data.return_type ||
      !data.warehouse_id ||
      !data.reason
    ) {
      return res.status(400).json({
        error: 'Missing required fields: return_no, invoice_no, return_date, return_type, warehouse_id, reason',
      });
    }

    const newReturn = await prisma.returns.create({
      data: {
        return_no: data.return_no,
        reference_no: data.reference_no || undefined,
        invoice_no: data.invoice_no,
        return_date: new Date(data.return_date),
        return_type: data.return_type, // Must be 'Sales' or 'Purchase'
        customer_id: data.customer_id ? BigInt(data.customer_id) : undefined,
        vendor_id: data.vendor_id ? BigInt(data.vendor_id) : undefined,
        warehouse_id: BigInt(data.warehouse_id),
        reason: data.reason,
        status: data.status || 'Open', // Default to 'Open'
        created_at: data.created_at ? new Date(data.created_at) : new Date(),
      },
    });

    res.status(201).json(newReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedReturn = await prisma.returns.update({
      where: { id: BigInt(id) },
      data: {
        return_no: data.return_no !== undefined ? data.return_no : undefined,
        reference_no: data.reference_no !== undefined ? data.reference_no : undefined,
        invoice_no: data.invoice_no !== undefined ? data.invoice_no : undefined,
        return_date: data.return_date ? new Date(data.return_date) : undefined,
        return_type: data.return_type !== undefined ? data.return_type : undefined,
        customer_id: data.customer_id !== undefined ? BigInt(data.customer_id) : undefined,
        vendor_id: data.vendor_id !== undefined ? BigInt(data.vendor_id) : undefined,
        warehouse_id: data.warehouse_id !== undefined ? BigInt(data.warehouse_id) : undefined,
        reason: data.reason !== undefined ? data.reason : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedReturn);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Return not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteReturn = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.returns.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Return deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Return not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn,
};