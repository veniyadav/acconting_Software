// src/controllers/salesReturnController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const getAllSalesReturns = async (req, res) => {
  try {
    const salesReturns = await prisma.sales_returns.findMany({
      include: {
        accounts: true,        // customer_id → accounts (customer's ledger account)
        warehouses: true,      // warehouse info
        sales_invoices: true,  // linked invoice
        users: true,           // created_by user
        companies: true,       // company info
        // sales_return_items: true, // optional: include if needed
      },
    });
    res.json(salesReturns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesReturn = await prisma.sales_returns.findUnique({
      where: { id: BigInt(id) },
      include: {
        accounts: true,
        warehouses: true,
        sales_invoices: true,
        users: true,
        companies: true,
      },
    });

    if (!salesReturn) {
      return res.status(404).json({ error: 'Sales Return not found' });
    }

    res.json(salesReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSalesReturn = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.company_id || !data.customer_id || !data.warehouse_id || !data.return_date) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, customer_id, warehouse_id, return_date'
      });
    }

    const newSalesReturn = await prisma.sales_returns.create({
      data,
    });

    res.status(201).json(newSalesReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSalesReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.sales_returns.update({
      where: { id: BigInt(id) },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sales Return not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteSalesReturn = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if linked to items
    const itemCount = await prisma.sales_return_items.count({
      where: { sales_return_id: BigInt(id) }
    });

    if (itemCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete: Sales Return has associated items',
        details: `${itemCount} item(s) linked`
      });
    }

    await prisma.sales_returns.delete({
      where: { id: BigInt(id) }
    });

    res.json({ message: 'Sales Return deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sales Return not found' });
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