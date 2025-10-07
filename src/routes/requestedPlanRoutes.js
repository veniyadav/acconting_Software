// routes/requestedPlanRoutes.js
import { Router } from "express";
import * as controller from "../controllers/requestedPlanController.js";
import { validateRequestedPlan } from "../middlewares/requestedPlanMiddleware.js";

const router = Router();

// GET /api/requested-plans
router.get("/", controller.getAllRequestedPlans);

// GET /api/requested-plans/:id
router.get("/:id", controller.getRequestedPlanById);

// POST /api/requested-plans
router.post("/", validateRequestedPlan, controller.createRequestedPlan);

// PUT /api/requested-plans/:id
router.put("/:id", validateRequestedPlan, controller.updateRequestedPlan);

// DELETE /api/requested-plans/:id
router.delete("/:id", controller.deleteRequestedPlan);

export default router;
