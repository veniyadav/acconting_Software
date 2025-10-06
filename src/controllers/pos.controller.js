import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPOS = async (req, res) => {
  try {
    const { customer_id, product_id, tax_id, quantity } = req.body;

    if (!customer_id || !product_id || !tax_id || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const posEntry = await prisma.pOSModal.create({
      data: {
        customer_id: Number(customer_id),
        product_id: Number(product_id),
        tax_id: Number(tax_id),
        quantity: Number(quantity),
      },
    });

    return res.status(201).json({
      message: "POS entry created successfully",
      posEntry,
    });
  } catch (error) {
    console.error("Error creating POS entry:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};