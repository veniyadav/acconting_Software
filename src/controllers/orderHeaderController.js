// controllers/orderHeaderController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all order headers
const getAllOrderHeaders = async (req, res) => {
  try {
    const orderHeaders = await prisma.order_headers.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(orderHeaders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order header by ID
const getOrderHeaderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderHeader = await prisma.order_headers.findUnique({
      where: { id: BigInt(id) },
    });

    if (!orderHeader) {
      return res.status(404).json({ error: 'Order header not found' });
    }

    res.json(orderHeader);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new order header
const createOrderHeader = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.company_id || !data.order_type || !data.order_no || !data.order_date || data.sub_total === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrderHeader = await prisma.order_headers.create({
      data: {
        company_id: BigInt(data.company_id),
        order_type: data.order_type,
        customer_id: data.customer_id ? BigInt(data.customer_id) : undefined,
        vendor_id: data.vendor_id ? BigInt(data.vendor_id) : undefined,
        order_no: data.order_no,
        manual_order_no: data.manual_order_no || undefined,
        order_date: new Date(data.order_date),
        sub_total: parseFloat(data.sub_total),
        total_tax: parseFloat(data.total_tax) || 0,
        total_discount: parseFloat(data.total_discount) || 0,
        grand_total: parseFloat(data.grand_total),
        notes: data.notes || '',
        terms_conditions: data.terms_conditions || '',
        bank_name: data.bank_name || undefined,
        account_number: data.account_number || undefined,
        account_holder: data.account_holder || undefined,
        ifsc_code: data.ifsc_code || undefined,
        status: data.status || 'draft',
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: new Date(data.created_at) || new Date(),
        updated_at: new Date(), // auto set on creation
      },
    });

    res.status(201).json(newOrderHeader);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order header
const updateOrderHeader = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedOrderHeader = await prisma.order_headers.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        order_type: data.order_type !== undefined ? data.order_type : undefined,
        customer_id: data.customer_id !== undefined ? BigInt(data.customer_id) : undefined,
        vendor_id: data.vendor_id !== undefined ? BigInt(data.vendor_id) : undefined,
        order_no: data.order_no !== undefined ? data.order_no : undefined,
        manual_order_no: data.manual_order_no !== undefined ? data.manual_order_no : undefined,
        order_date: data.order_date ? new Date(data.order_date) : undefined,
        sub_total: data.sub_total !== undefined ? parseFloat(data.sub_total) : undefined,
        total_tax: data.total_tax !== undefined ? parseFloat(data.total_tax) : undefined,
        total_discount: data.total_discount !== undefined ? parseFloat(data.total_discount) : undefined,
        grand_total: data.grand_total !== undefined ? parseFloat(data.grand_total) : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        terms_conditions: data.terms_conditions !== undefined ? data.terms_conditions : undefined,
        bank_name: data.bank_name !== undefined ? data.bank_name : undefined,
        account_number: data.account_number !== undefined ? data.account_number : undefined,
        account_holder: data.account_holder !== undefined ? data.account_holder : undefined,
        ifsc_code: data.ifsc_code !== undefined ? data.ifsc_code : undefined,
        status: data.status !== undefined ? data.status : undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        updated_at: new Date(),
      },
    });

    res.json(updatedOrderHeader);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order header not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete order header
const deleteOrderHeader = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order_headers.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Order header deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order header not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllOrderHeaders,
  getOrderHeaderById,
  createOrderHeader,
  updateOrderHeader,
  deleteOrderHeader,
};