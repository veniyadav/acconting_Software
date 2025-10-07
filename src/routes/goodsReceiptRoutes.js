import express from 'express';
import { createGoodsReceipt, deleteGoodsReceipt, getAllGoodsReceipts, getGoodsReceiptById, updateGoodsReceipt } from '../controllers/goodsReceiptController.js';

const router = express.Router();



// GET /api/goods-receipts
router.get('/', getAllGoodsReceipts);

// GET /api/goods-receipts/:id
router.get('/:id', getGoodsReceiptById);

// POST /api/goods-receipts
router.post('/', createGoodsReceipt);

// PUT /api/goods-receipts/:id
router.put('/:id', updateGoodsReceipt);

// DELETE /api/goods-receipts/:id
router.delete('/:id', deleteGoodsReceipt);

export default router;