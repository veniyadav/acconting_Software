// routes/voucherRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/voucherController.js';
import { validateVoucher } from '../middlewares/voucherMiddleware.js';

const router = Router();

// GET /api/vouchers
router.get('/', controller.getAllVouchers);

// GET /api/vouchers/:id
router.get('/:id', controller.getVoucherById);

// POST /api/vouchers
router.post('/', validateVoucher, controller.createVoucher);

// PUT /api/vouchers/:id
router.put('/:id', validateVoucher, controller.updateVoucher);

// DELETE /api/vouchers/:id
router.delete('/:id', controller.deleteVoucher);

export default router; 