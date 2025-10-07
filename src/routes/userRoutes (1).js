// routes/userRoutes.js
import { Router } from "express";
import * as controller from "../controllers/userController.js";
import { validateUser } from "../middlewares/userMiddleware.js";

const router = Router();

// GET /api/users
router.get("/", controller.getAllUsers);

// GET /api/users/:id
router.get("/:id", controller.getUserById);

// POST /api/users
router.post("/", validateUser, controller.createUser);

// PUT /api/users/:id
router.put("/:id", validateUser, controller.updateUser);

// DELETE /api/users/:id
router.delete("/:id", controller.deleteUser);

export default router;
