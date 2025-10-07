// controllers/purchaseBillController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllPurchaseBills = async (req, res) => {
  try {
    const purchaseBills = await prisma.purchase_bills.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(purchaseBills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPurchaseBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseBill = await prisma.purchase_bills.findUnique({
      where: { id: BigInt(id) },
    });

    if (!purchaseBill) {
      return res.status(404).json({ error: 'Purchase bill not found' });
    }

    res.json(purchaseBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPurchaseBill = async (req, res) => {
  try {
    const data = req.body;

    const newPurchaseBill = await prisma.purchase_bills.create({
      data: {
        company_id: BigInt(data.company_id),
        vendor_id: BigInt(data.vendor_id),
        bill_no: data.bill_no,
        bill_date: new Date(data.bill_date),
        due_date: new Date(data.due_date),
        total_amount: parseFloat(data.total_amount),
        outstanding_amount: parseFloat(data.outstanding_amount),
        status: data.status || 'pending',
        notes: data.notes || '',
        terms_conditions: data.terms_conditions || '',
        attachment_urls: data.attachment_urls ? JSON.parse(data.attachment_urls) : [],
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: new Date(data.created_at) || new Date(),
      },
    });

    res.status(201).json(newPurchaseBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePurchaseBill = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedPurchaseBill = await prisma.purchase_bills.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        vendor_id: data.vendor_id ? BigInt(data.vendor_id) : undefined,
        bill_no: data.bill_no !== undefined ? data.bill_no : undefined,
        bill_date: data.bill_date ? new Date(data.bill_date) : undefined,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        total_amount: data.total_amount !== undefined ? parseFloat(data.total_amount) : undefined,
        outstanding_amount: data.outstanding_amount !== undefined ? parseFloat(data.outstanding_amount) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        terms_conditions: data.terms_conditions !== undefined ? data.terms_conditions : undefined,
        attachment_urls: data.attachment_urls !== undefined ? JSON.parse(data.attachment_urls) : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedPurchaseBill);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Purchase bill not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deletePurchaseBill = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.purchase_bills.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Purchase bill deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Purchase bill not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllPurchaseBills,
  getPurchaseBillById,
  createPurchaseBill,
  updatePurchaseBill,
  deletePurchaseBill,
};