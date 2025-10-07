// routes/planRoutes.js
import { Router } from "express";
import * as controller from "../controllers/planController.js";
import { validatePlan } from "../middlewares/planMiddleware.js";

const router = Router();

// GET /api/plans
router.get("/", controller.getAllPlans);

// GET /api/plans/:id
router.get("/:id", controller.getPlanById);

// POST /api/plans
router.post("/", validatePlan, controller.createPlan);

// PUT /api/plans/:id
router.put("/:id", validatePlan, controller.updatePlan);

// DELETE /api/plans/:id
router.delete("/:id", controller.deletePlan);

export default router;
