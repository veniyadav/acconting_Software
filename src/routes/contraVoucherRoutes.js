// routes/contraVoucherRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/contraVoucherController.js';
import { validateContraVoucher } from '../middlewares/contraVoucherMiddleware.js';

const router = Router();

// GET /api/contra-vouchers
router.get('/', controller.getAllContraVouchers);

// GET /api/contra-vouchers/:id
router.get('/:id', controller.getContraVoucherById);

// POST /api/contra-vouchers
router.post('/', validateContraVoucher, controller.createContraVoucher);

// PUT /api/contra-vouchers/:id
router.put('/:id', validateContraVoucher, controller.updateContraVoucher);

// DELETE /api/contra-vouchers/:id
router.delete('/:id', controller.deleteContraVoucher);

export default router;