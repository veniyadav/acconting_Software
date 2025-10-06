//aman
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * ✅ Create new stock transfer (with items)
 */
export const createStockTransfer = async (req, res) => {
  try {
    const {
      company_id,
      system_voucher_no,
      manual_voucher_no,
      voucher_date,
      destination_warehouse_id,
      additional_note,
      total_amount,
      items, // [{ item_id, source_warehouse_id, qty, rate, amount, narration }]
    } = req.body;

    // Validate company_id foreign key
    const companyExists = await prisma.companies.findUnique({
      where: { id: BigInt(company_id) },
    });
    if (!companyExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid company_id — company not found.",
      });
    }

    // Transaction ensures atomicity
    const newTransfer = await prisma.$transaction(async (tx) => {
      const transfer = await tx.stock_transfers.create({
        data: {
          company_id: BigInt(company_id),
          system_voucher_no,
          manual_voucher_no,
          voucher_date: voucher_date ? new Date(voucher_date) : new Date(),
          destination_warehouse_id: destination_warehouse_id
            ? BigInt(destination_warehouse_id)
            : null,
          additional_note,
          total_amount,
        },
      });

      if (items && items.length > 0) {
        await tx.stock_transfer_items.createMany({
          data: items.map((item) => ({
            stock_transfer_id: transfer.id,
            item_id: item.item_id ? BigInt(item.item_id) : null,
            source_warehouse_id: item.source_warehouse_id
              ? BigInt(item.source_warehouse_id)
              : null,
            qty: item.qty,
            rate: item.rate,
            amount: item.amount,
            narration: item.narration,
          })),
        });
      }

      return transfer;
    });

    res.status(201).json({
      success: true,
      message: "Stock transfer created successfully",
      data: newTransfer,
    });
  } catch (error) {
    console.error("❌ Error creating stock transfer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create stock transfer",
      error: error.message,
    });
  }
};

/**
 * ✅ Get all stock transfers
 */
export const getAllStockTransfers = async (req, res) => {
  try {
    const transfers = await prisma.stock_transfers.findMany({
      include: { stock_transfer_items: true },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({ success: true, data: transfers });
  } catch (error) {
    console.error("❌ Error fetching transfers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock transfers",
      error: error.message,
    });
  }
};

/**
 * ✅ Get stock transfer by ID
 */
export const getStockTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await prisma.stock_transfers.findUnique({
      where: { id: BigInt(id) },
      include: { stock_transfer_items: true },
    });

    if (!transfer)
      return res
        .status(404)
        .json({ success: false, message: "Stock transfer not found" });

    res.status(200).json({ success: true, data: transfer });
  } catch (error) {
    console.error("❌ Error fetching stock transfer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock transfer",
      error: error.message,
    });
  }
};

/**
 * ✅ Get stock transfers by company_id
 */
export const getStockTransfersByCompanyId = async (req, res) => {
  try {
    const { company_id } = req.params;
    const transfers = await prisma.stock_transfers.findMany({
      where: { company_id: BigInt(company_id) },
      include: { stock_transfer_items: true },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({ success: true, data: transfers });
  } catch (error) {
    console.error("❌ Error fetching transfers by company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock transfers by company ID",
      error: error.message,
    });
  }
};

/**
 * ✅ Update stock transfer
 */
export const updateStockTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      manual_voucher_no,
      voucher_date,
      destination_warehouse_id,
      additional_note,
      total_amount,
      items,
    } = req.body;

    await prisma.$transaction(async (tx) => {
      await tx.stock_transfers.update({
        where: { id: BigInt(id) },
        data: {
          manual_voucher_no,
          voucher_date: voucher_date ? new Date(voucher_date) : new Date(),
          destination_warehouse_id: destination_warehouse_id
            ? BigInt(destination_warehouse_id)
            : null,
          additional_note,
          total_amount,
          updated_at: new Date(),
        },
      });

      await tx.stock_transfer_items.deleteMany({
        where: { stock_transfer_id: BigInt(id) },
      });

      if (items && items.length > 0) {
        await tx.stock_transfer_items.createMany({
          data: items.map((item) => ({
            stock_transfer_id: BigInt(id),
            item_id: item.item_id ? BigInt(item.item_id) : null,
            source_warehouse_id: item.source_warehouse_id
              ? BigInt(item.source_warehouse_id)
              : null,
            qty: item.qty,
            rate: item.rate,
            amount: item.amount,
            narration: item.narration,
          })),
        });
      }
    });

    res
      .status(200)
      .json({ success: true, message: "Stock transfer updated successfully" });
  } catch (error) {
    console.error("❌ Error updating stock transfer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update stock transfer",
      error: error.message,
    });
  }
};

/**
 * ✅ Delete stock transfer
 */
export const deleteStockTransfer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      await tx.stock_transfer_items.deleteMany({
        where: { stock_transfer_id: BigInt(id) },
      });
      await tx.stock_transfers.delete({
        where: { id: BigInt(id) },
      });
    });

    res
      .status(200)
      .json({ success: true, message: "Stock transfer deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting stock transfer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete stock transfer",
      error: error.message,
    });
  }
};
