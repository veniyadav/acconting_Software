// routes/roleRoutes.js
import { Router } from "express";
import * as controller from "../controllers/roleController.js";
import { validateRole } from "../middlewares/roleMiddleware.js";

const router = Router();

// GET /api/roles
router.get("/", controller.getAllRoles);

// GET /api/roles/:id
router.get("/:id", controller.getRoleById);

// POST /api/roles
router.post("/", validateRole, controller.createRole);

// PUT /api/roles/:id
router.put("/:id", validateRole, controller.updateRole);

// DELETE /api/roles/:id
router.delete("/:id", controller.deleteRole);

export default router;
