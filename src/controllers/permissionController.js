// controllers/permissionController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all permissions */
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permissions.findMany({
      orderBy: { id: "asc" },
    });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET permission by ID */
export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await prisma.permissions.findUnique({
      where: { id: BigInt(id) },
    });

    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE new permission */
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newPermission = await prisma.permissions.create({
      data: { name, description },
    });

    res.status(201).json(newPermission);
  } catch (error) {
    // Prisma unique constraint (if applied later)
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Permission name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE permission */
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await prisma.permissions.update({
      where: { id: BigInt(id) },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Permission not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE permission */
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.permissions.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Permission not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
