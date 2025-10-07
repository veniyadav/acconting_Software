// controllers/deliveryChallanController.js
// controllers/expenseVoucherController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 🔹 GET all delivery challans */
export const getAllDeliveryChallans = async (req, res) => {
  try {
    const challans = await prisma.delivery_challans.findMany({
      include: {
        companies: true,
        sales_orders: true,
        users: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(challans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET single challan by ID */
export const getDeliveryChallanById = async (req, res) => {
  try {
    const { id } = req.params;
    const challan = await prisma.delivery_challans.findUnique({
      where: { id: BigInt(id) },
      include: {
        companies: true,
        sales_orders: true,
        users: true,
      },
    });

    if (!challan) {
      return res.status(404).json({ error: "Delivery challan not found" });
    }

    res.json(challan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE new challan */
export const createDeliveryChallan = async (req, res) => {
  try {
    const data = req.body;

    const newChallan = await prisma.delivery_challans.create({
      data: {
        company_id: BigInt(data.company_id),
        order_id: BigInt(data.order_id),
        challan_no: data.challan_no,
        manual_ref_no: data.manual_ref_no || null,
        challan_date: new Date(data.challan_date),
        driver_name: data.driver_name,
        driver_phone: data.driver_phone,
        vehicle_no: data.vehicle_no,
        total_amount: parseFloat(data.total_amount),
        terms: data.terms || "",
        status: data.status || "Draft",
        created_by: data.created_by ? BigInt(data.created_by) : null,
        created_at: new Date(),
      },
    });

    res.status(201).json(newChallan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE challan */
export const updateDeliveryChallan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedChallan = await prisma.delivery_challans.update({
      where: { id: BigInt(id) },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        order_id: data.order_id ? BigInt(data.order_id) : undefined,
        challan_no: data.challan_no ?? undefined,
        manual_ref_no: data.manual_ref_no ?? undefined,
        challan_date: data.challan_date ? new Date(data.challan_date) : undefined,
        driver_name: data.driver_name ?? undefined,
        driver_phone: data.driver_phone ?? undefined,
        vehicle_no: data.vehicle_no ?? undefined,
        total_amount: data.total_amount ? parseFloat(data.total_amount) : undefined,
        terms: data.terms ?? undefined,
        status: data.status ?? undefined,
        created_by: data.created_by ? BigInt(data.created_by) : undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
      },
    });

    res.json(updatedChallan);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Delivery challan not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE challan */
export const deleteDeliveryChallan = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.delivery_challans.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: "Delivery challan deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Delivery challan not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
