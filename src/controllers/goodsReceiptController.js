import prisma from "../config/prisma.js";

// Get all goods receipts
const getAllGoodsReceipts = async (req, res) => {
  try {
    const goodsReceipts = await prisma.goods_receipts.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    res.json(goodsReceipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single goods receipt by ID
const getGoodsReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const goodsReceipt = await prisma.goods_receipts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!goodsReceipt) {
      return res.status(404).json({ error: 'Goods Receipt not found' });
    }

    res.json(goodsReceipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new goods receipt
const createGoodsReceipt = async (req, res) => {
  try {
    const data = req.body;

    const newGoodsReceipt = await prisma.goods_receipts.create({
      data: {
        company_id: BigInt(data.company_id),
        purchase_order_id: BigInt(data.purchase_order_id),
        grn_no: data.grn_no,
        receipt_date: new Date(data.receipt_date),
        warehouse_id: BigInt(data.warehouse_id),
        grn_note: data.grn_note || null,
        received_by: data.received_by || null,
        signature_url: data.signature_url || null,
        photo_url: data.photo_url || null,
        status: data.status || 'pending', // default status
      },
    });

    res.status(201).json(newGoodsReceipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a goods receipt
const updateGoodsReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedGoodsReceipt = await prisma.goods_receipts.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        purchase_order_id: data.purchase_order_id ? BigInt(data.purchase_order_id) : undefined,
        grn_no: data.grn_no !== undefined ? data.grn_no : undefined,
        receipt_date: data.receipt_date ? new Date(data.receipt_date) : undefined,
        warehouse_id: data.warehouse_id ? BigInt(data.warehouse_id) : undefined,
        grn_note: data.grn_note !== undefined ? data.grn_note : undefined,
        received_by: data.received_by !== undefined ? data.received_by : undefined,
        signature_url: data.signature_url !== undefined ? data.signature_url : undefined,
        photo_url: data.photo_url !== undefined ? data.photo_url : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
    });

    res.json(updatedGoodsReceipt);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Goods Receipt not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a goods receipt
const deleteGoodsReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.goods_receipts.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: 'Goods Receipt deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Goods Receipt not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllGoodsReceipts,
  getGoodsReceiptById,
  createGoodsReceipt,
  updateGoodsReceipt,
  deleteGoodsReceipt,
};  