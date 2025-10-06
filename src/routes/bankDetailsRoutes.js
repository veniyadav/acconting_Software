import express from "express";
import { createBankDetails, deleteBankDetails, getAllBankDetails, getBankDetailsById, updateBankDetails } from "../controllers/bankDetailsController.js";
import { validateBankDetails } from "../middlewares/bankDetailsMiddleware.js";

const router = express.Router();



// Routes for bank details
router.get('/', getAllBankDetails);
router.get('/:id', getBankDetailsById);
router.post('/', validateBankDetails, createBankDetails);
router.put('/:id', validateBankDetails, updateBankDetails);
router.delete('/:id', deleteBankDetails);

export default router;