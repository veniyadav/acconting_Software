// controllers/rolePermissionController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all role-permissions */
export const getAllRolePermissions = async (req, res) => {
  try {
    const rolePermissions = await prisma.role_permissions.findMany({
      include: {
        roles: true,
        modules: true,
        permissions: true,
      },
      orderBy: { id: "asc" },
    });
    res.json(rolePermissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET single mapping by ID */
export const getRolePermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const rolePermission = await prisma.role_permissions.findUnique({
      where: { id: BigInt(id) },
      include: {
        roles: true,
        modules: true,
        permissions: true,
      },
    });

    if (!rolePermission) {
      return res.status(404).json({ error: "Role permission record not found" });
    }

    res.json(rolePermission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE mapping */
export const createRolePermission = async (req, res) => {
  try {
    const { role_id, module_id, permission_id, granted } = req.body;

    const newMapping = await prisma.role_permissions.create({
      data: {
        role_id: BigInt(role_id),
        module_id: BigInt(module_id),
        permission_id: BigInt(permission_id),
        granted: granted === true || granted === "true",
        created_at: new Date(),
      },
    });

    res.status(201).json(newMapping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE mapping */
export const updateRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, module_id, permission_id, granted } = req.body;

    const updated = await prisma.role_permissions.update({
      where: { id: BigInt(id) },
      data: {
        role_id: role_id ? BigInt(role_id) : undefined,
        module_id: module_id ? BigInt(module_id) : undefined,
        permission_id: permission_id ? BigInt(permission_id) : undefined,
        granted: granted !== undefined ? (granted === true || granted === "true") : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role permission record not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE mapping */
export const deleteRolePermission = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.role_permissions.delete({
      where: { id: BigInt(id) },
    });

    res.json({ message: "Role permission deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role permission record not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
