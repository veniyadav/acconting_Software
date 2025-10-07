// controllers/requestedPlanController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all requested plans */
export const getAllRequestedPlans = async (req, res) => {
  try {
    const requests = await prisma.requested_plans.findMany({
      include: {
        companies: true,
        plans: true,
      },
      orderBy: { id: "asc" },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET requested plan by ID */
export const getRequestedPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.requested_plans.findUnique({
      where: { id: BigInt(id) },
      include: {
        companies: true,
        plans: true,
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Requested plan not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE new requested plan */
export const createRequestedPlan = async (req, res) => {
  try {
    const { company_id, plan_id, billing, request_date, status } = req.body;

    const newRequest = await prisma.requested_plans.create({
      data: {
        company_id: BigInt(company_id),
        plan_id: BigInt(plan_id),
        billing,
        request_date: new Date(request_date),
        status: status || "Pending",
        created_at: new Date(),
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE requested plan */
export const updateRequestedPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_id, plan_id, billing, request_date, status } = req.body;

    const updatedRequest = await prisma.requested_plans.update({
      where: { id: BigInt(id) },
      data: {
        company_id: company_id ? BigInt(company_id) : undefined,
        plan_id: plan_id ? BigInt(plan_id) : undefined,
        billing: billing ?? undefined,
        request_date: request_date ? new Date(request_date) : undefined,
        status: status ?? undefined,
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Requested plan not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE requested plan */
export const deleteRequestedPlan = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.requested_plans.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: "Requested plan deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Requested plan not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
