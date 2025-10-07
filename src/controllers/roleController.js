// controllers/roleController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all roles */
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      orderBy: { id: "asc" },
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET role by ID */
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.roles.findUnique({
      where: { id: BigInt(id) },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE new role */
export const createRole = async (req, res) => {
  try {
    const { role_name, role_type, status } = req.body;

    const newRole = await prisma.roles.create({
      data: {
        role_name,
        role_type,
        status,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(201).json(newRole);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Role name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE role */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, role_type, status } = req.body;

    const updatedRole = await prisma.roles.update({
      where: { id: BigInt(id) },
      data: {
        role_name: role_name ?? undefined,
        role_type: role_type ?? undefined,
        status: status ?? undefined,
        updated_at: new Date(),
      },
    });

    res.json(updatedRole);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role not found" });
    }
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Role name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE role */
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.roles.delete({
      where: { id: BigInt(id) },
    });

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
