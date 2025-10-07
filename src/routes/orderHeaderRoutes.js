// routes/orderHeaderRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/orderHeaderController.js'
import { validateOrderHeader } from '../middlewares/orderHeaderMiddleware.js';

const router = Router();

// GET /api/order-headers
router.get('/', controller.getAllOrderHeaders);

// GET /api/order-headers/:id
router.get('/:id', controller.getOrderHeaderById);

// POST /api/order-headers
router.post('/', validateOrderHeader, controller.createOrderHeader);

// PUT /api/order-headers/:id
router.put('/:id', validateOrderHeader, controller.updateOrderHeader);

// DELETE /api/order-headers/:id
router.delete('/:id', controller.deleteOrderHeader);

export default router;