import express from "express";
import fileUpload from "express-fileupload";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { createPOS } from "../controllers/pos.controller.js";

const router = express.Router();

router.post("/", createPOS);

export default router;