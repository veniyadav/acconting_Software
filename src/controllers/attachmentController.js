import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const serializeBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

// CREATE
export const createAttachment = async (req, res) => {
  try {
    const { voucher_id, quotation_id, order_id, return_id, file_url, file_type, uploaded_by } = req.body;

    if (!file_url || !file_type) {
      return res.status(400).json({ success: false, message: "file_url and file_type are required" });
    }

    const newAttachment = await prisma.attachment.create({
      data: {
        voucher_id: voucher_id ? BigInt(voucher_id) : null,
        quotation_id: quotation_id ? BigInt(quotation_id) : null,
        order_id: order_id ? BigInt(order_id) : null,
        return_id: return_id ? BigInt(return_id) : null,
        file_url,
        file_type,
        uploaded_by: uploaded_by ? BigInt(uploaded_by) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Attachment created",
      data: serializeBigInt(newAttachment),
    });
  } catch (error) {
    console.error("Create attachment error:", error);
    res.status(500).json({ success: false, message: "Failed to create attachment", error: error.message });
  }
};

// GET ALL
export const getAllAttachments = async (req, res) => {
  try {
    const attachments = await prisma.attachments.findMany({ orderBy: { id: 'desc' } });
    res.json({ success: true, data: serializeBigInt(attachments) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch attachments", error: error.message });
  }
};

// GET BY ID
export const getAttachmentById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const attachment = await prisma.attachments.findUnique({ where: { id } });
    if (!attachment) return res.status(404).json({ success: false, message: "Attachment not found" });
    res.json({ success: true, data: serializeBigInt(attachment) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch attachment", error: error.message });
  }
};

// UPDATE
export const updateAttachment = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const { voucher_id, quotation_id, order_id, return_id, file_url, file_type, uploaded_by } = req.body;

    const data = {};
    if (file_url !== undefined) data.file_url = file_url;
    if (file_type !== undefined) data.file_type = file_type;
    if (voucher_id !== undefined) data.voucher_id = voucher_id ? BigInt(voucher_id) : null;
    if (quotation_id !== undefined) data.quotation_id = quotation_id ? BigInt(quotation_id) : null;
    if (order_id !== undefined) data.order_id = order_id ? BigInt(order_id) : null;
    if (return_id !== undefined) data.return_id = return_id ? BigInt(return_id) : null;
    if (uploaded_by !== undefined) data.uploaded_by = uploaded_by ? BigInt(uploaded_by) : null;

    const updated = await prisma.attachments.update({ where: { id }, data });
    res.json({ success: true, message: "Attachment updated", data: serializeBigInt(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update attachment", error: error.message });
  }
};

// DELETE
export const deleteAttachment = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.attachments.delete({ where: { id } });
    res.json({ success: true, message: "Attachment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete attachment", error: error.message });
  }
};