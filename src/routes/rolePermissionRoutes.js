// routes/rolePermissionRoutes.js
import { Router } from "express";
import * as controller from "../controllers/rolePermissionController.js";
import { validateRolePermission } from "../middlewares/rolePermissionMiddleware.js";

const router = Router();

// GET /api/role-permissions
router.get("/", controller.getAllRolePermissions);

// GET /api/role-permissions/:id
router.get("/:id", controller.getRolePermissionById);

// POST /api/role-permissions
router.post("/", validateRolePermission, controller.createRolePermission);

// PUT /api/role-permissions/:id
router.put("/:id", validateRolePermission, controller.updateRolePermission);

// DELETE /api/role-permissions/:id
router.delete("/:id", controller.deleteRolePermission);

export default router;
