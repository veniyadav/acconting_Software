// routes/deliveryChallanRoutes.js
import { Router } from "express";
import * as controller from "../controllers/deliveryChallan.controller.js";
import { validateDeliveryChallan } from "../middlewares/deliveryChallanMiddleware.js";

const router = Router();

// GET all challans
router.get("/", controller.getAllDeliveryChallans);

// GET single challan
router.get("/:id", controller.getDeliveryChallanById);

// CREATE challan
router.post("/", validateDeliveryChallan, controller.createDeliveryChallan);

// UPDATE challan
router.put("/:id", validateDeliveryChallan, controller.updateDeliveryChallan);

// DELETE challan
router.delete("/:id", controller.deleteDeliveryChallan);

export default router;
