import express from 'express';
import {
  createEwayBill,
  getAllEwayBills,
  getEwayBillById,
  updateEwayBill,
  deleteEwayBill
} from '../controllers/ewayBillController.js';

const router = express.Router();

router.post('/', createEwayBill);
router.get('/', getAllEwayBills);
router.get('/:id', getEwayBillById);
router.put('/:id', updateEwayBill);
router.delete('/:id', deleteEwayBill);

export default router;