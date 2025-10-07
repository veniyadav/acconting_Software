// routes/purchaseBillRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/purchaseBillController.js';
import { validatePurchaseBill } from '../middlewares/purchaseBillMiddleware.js';

const router = Router();

// GET /api/purchase-bills
router.get('/', controller.getAllPurchaseBills);

// GET /api/purchase-bills/:id
router.get('/:id', controller.getPurchaseBillById);

// POST /api/purchase-bills
router.post('/', validatePurchaseBill, controller.createPurchaseBill);

// PUT /api/purchase-bills/:id
router.put('/:id', validatePurchaseBill, controller.updatePurchaseBill);

// DELETE /api/purchase-bills/:id
router.delete('/:id', controller.deletePurchaseBill);

export default router;