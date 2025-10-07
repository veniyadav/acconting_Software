// routes/returnRoutes.js
import { Router } from 'express';
import * as controller from '../controllers/returnController.js';
import { validateReturn } from '../middlewares/returnMiddleware.js';

const router = Router();

router.get('/', controller.getAllReturns);
router.get('/:id', controller.getReturnById);
router.post('/', validateReturn, controller.createReturn);
router.put('/:id', validateReturn, controller.updateReturn);
router.delete('/:id', controller.deleteReturn);

export default router;