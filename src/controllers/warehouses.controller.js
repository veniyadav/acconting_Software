import prisma from "../config/prisma.js";
import { PrismaClient } from "@prisma/client";
/**
 * 🧰 Helper: Convert BigInt values to Number for JSON responses
 */
const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
};

/**
 * 🟢 Create Warehouse
 */
export const createWarehouse = async (req, res) => {
  try {
    const { company_id, warehouse_name, location, contact_person, phone, status } = req.body;

    const newWarehouse = await prisma.warehouses.create({
      data: {
        company_id: company_id ? BigInt(company_id) : null,
        warehouse_name,
        location,
        contact_person,
        phone,
        status,
      },
    });

    res.status(201).json({
      success: true,
      data: serializeBigInt(newWarehouse),
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟡 Get All Warehouses
 */
export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouses.findMany({
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      data: serializeBigInt(warehouses),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟡 Get Warehouse by ID
 */
export const getWarehouseById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const warehouse = await prisma.warehouses.findUnique({ where: { id } });

    if (!warehouse)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      data: serializeBigInt(warehouse),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🟠 Update Warehouse
 */
export const updateWarehouse = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const { warehouse_name, location, contact_person, phone, status, company_id } = req.body;

    const updated = await prisma.warehouses.update({
      where: { id },
      data: {
        warehouse_name,
        location,
        contact_person,
        phone,
        status,
        company_id: company_id ? BigInt(company_id) : null,
      },
    });

    res.json({
      success: true,
      data: serializeBigInt(updated),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 🔴 Delete Warehouse
 */
export const deleteWarehouse = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.warehouses.delete({ where: { id } });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
