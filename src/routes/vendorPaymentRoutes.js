// routes/vendorPaymentRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/vendorPaymentController.js';
import { validateVendorPayment } from '../middlewares/vendorPaymentMiddleware.js';

const router = Router();

// GET /api/vendor-payments
router.get('/', controller.getAllVendorPayments);

// GET /api/vendor-payments/:id
router.get('/:id', controller.getVendorPaymentById);

// POST /api/vendor-payments
router.post('/', validateVendorPayment, controller.createVendorPayment);

// PUT /api/vendor-payments/:id
router.put('/:id', validateVendorPayment, controller.updateVendorPayment);

// DELETE /api/vendor-payments/:id
router.delete('/:id', controller.deleteVendorPayment);

export default router;