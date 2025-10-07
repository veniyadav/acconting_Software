// routes/expenseVoucherRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/expenseVoucherController.js';
import { validateExpenseVoucher } from '../middlewares/expenseVoucherMiddleware.js';

const router = Router();

router.get('/', controller.getAllExpenseVouchers);
router.get('/:id', controller.getExpenseVoucherById);
router.post('/', validateExpenseVoucher, controller.createExpenseVoucher);
router.put('/:id', validateExpenseVoucher, controller.updateExpenseVoucher);
router.delete('/:id', controller.deleteExpenseVoucher);

export default router;