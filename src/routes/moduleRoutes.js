// routes/moduleRoutes.js
import { Router } from "express";
import * as controller from "../controllers/moduleController.js";
import { validateModule } from "../middlewares/moduleMiddleware.js";

const router = Router();

// GET /api/modules
router.get("/", controller.getAllModules);

// GET /api/modules/:id
router.get("/:id", controller.getModuleById);

// POST /api/modules
router.post("/", validateModule, controller.createModule);

// PUT /api/modules/:id
router.put("/:id", validateModule, controller.updateModule);

// DELETE /api/modules/:id
router.delete("/:id", controller.deleteModule);

export default router;
