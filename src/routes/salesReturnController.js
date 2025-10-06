// src/routes/salesReturnRoutes.js

import express from "express";
import { createSalesReturn, deleteSalesReturn, getAllSalesReturns, getSalesReturnById, updateSalesReturn } from "../controllers/salesReturnController.js";


const router = express.Router();


router.get('/', getAllSalesReturns);
router.get('/:id', getSalesReturnById);
router.post('/',  createSalesReturn);
router.put('/:id', updateSalesReturn);
router.delete('/:id',deleteSalesReturn);

export default  router;