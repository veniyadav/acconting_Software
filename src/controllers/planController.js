// controllers/planController.js
import { PrismaClient, products_status } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all plans */
export const getAllPlans = async (req, res) => {
  try {
    const plans = await prisma.plans.findMany({
      orderBy: { id: "asc" },
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET plan by ID */
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plans.findUnique({
      where: { id: BigInt(id) },
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE new plan */
export const createPlan = async (req, res) => {
  try {
    const {
      plan_name,
      currency,
      base_price,
      total_price,
      invoice_limit,
      user_limit,
      storage_capacity,
      billing_cycle,
      status,
    } = req.body;

    const newPlan = await prisma.plans.create({
      data: {
        plan_name,
        currency,
        base_price: parseFloat(base_price),
        total_price: parseFloat(total_price),
        invoice_limit: parseInt(invoice_limit),
        user_limit: parseInt(user_limit),
        storage_capacity,
        billing_cycle,
        status: status || "Active",
        created_at: new Date(),
      },
    });

    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE plan */
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedPlan = await prisma.plans.update({
      where: { id: BigInt(id) },
      data: {
        plan_name: data.plan_name ?? undefined,
        currency: data.currency ?? undefined,
        base_price: data.base_price ? parseFloat(data.base_price) : undefined,
        total_price: data.total_price ? parseFloat(data.total_price) : undefined,
        invoice_limit: data.invoice_limit ? parseInt(data.invoice_limit) : undefined,
        user_limit: data.user_limit ? parseInt(data.user_limit) : undefined,
        storage_capacity: data.storage_capacity ?? undefined,
        billing_cycle: data.billing_cycle ?? undefined,
        status: data.status ?? undefined,
      },
    });

    res.json(updatedPlan);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE plan */
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plans.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
