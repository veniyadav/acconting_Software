// routes/permissionRoutes.js
import { Router } from "express";
import * as controller from "../controllers/permissionController.js";
import { validatePermission } from "../middlewares/permissionMiddleware.js";

const router = Router();

// GET /api/permissions
router.get("/", controller.getAllPermissions);

// GET /api/permissions/:id
router.get("/:id", controller.getPermissionById);

// POST /api/permissions
router.post("/", validatePermission, controller.createPermission);

// PUT /api/permissions/:id
router.put("/:id", validatePermission, controller.updatePermission);

// DELETE /api/permissions/:id
router.delete("/:id", controller.deletePermission);

export default router;
