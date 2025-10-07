// routes/incomeVoucherRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/incomeVoucherController.js';
import { validateIncomeVoucher } from '../middlewares/incomeVoucherMiddleware.js';

const router = Router();

// GET /api/income-vouchers
router.get('/', controller.getAllIncomeVouchers);

// GET /api/income-vouchers/:id
router.get('/:id', controller.getIncomeVoucherById);

// POST /api/income-vouchers
router.post('/', validateIncomeVoucher, controller.createIncomeVoucher);

// PUT /api/income-vouchers/:id
router.put('/:id', validateIncomeVoucher, controller.updateIncomeVoucher);

// DELETE /api/income-vouchers/:id
router.delete('/:id', controller.deleteIncomeVoucher);

export default router;