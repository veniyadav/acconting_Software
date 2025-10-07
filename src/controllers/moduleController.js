// controllers/moduleController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all modules */
export const getAllModules = async (req, res) => {
  try {
    const modules = await prisma.modules.findMany({
      orderBy: { id: "asc" },
    });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET single module by ID */
export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await prisma.modules.findUnique({
      where: { id: BigInt(id) },
    });

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE new module */
export const createModule = async (req, res) => {
  try {
    const { module_name, description } = req.body;

    const newModule = await prisma.modules.create({
      data: {
        module_name,
        description,
        created_at: new Date(),
      },
    });

    res.status(201).json(newModule);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Module name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE module */
export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { module_name, description } = req.body;

    const updatedModule = await prisma.modules.update({
      where: { id: BigInt(id) },
      data: {
        module_name: module_name ?? undefined,
        description: description ?? undefined,
      },
    });

    res.json(updatedModule);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Module not found" });
    }
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Module name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE module */
export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.modules.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Module not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
