import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 Get all quotations
export const getQuotations = async (req, res) => {
  try {
    const quotations = await prisma.sales_quotations.findMany({
      include: {
        sales_quotation_items: true, // relation
        companies: true, // optional, for company info
        accounts: true, // linked customer account
        users: true, // created_by user
      },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json(quotations);
  } catch (err) {
    console.error("❌ Error fetching quotations:", err);
    res.status(500).json({
      message: "Error fetching quotations",
      error: err.message,
    });
  }
};

// 🔹 Create new quotation
export const createQuotation = async (req, res) => {
  try {
    const {
      company_id,
      customer_id,
      quotation_no,
      manual_ref_no,
      quotation_date,
      valid_till,
      total_amount,
      tax_amount,
      discount_amount,
      grand_total,
      notes,
      terms,
      created_by,
      items = [],
    } = req.body;

    const quotation = await prisma.sales_quotations.create({
      data: {
        company_id,
        customer_id,
        quotation_no,
        manual_ref_no,
        quotation_date: new Date(quotation_date),
        valid_till: new Date(valid_till),
        total_amount,
        tax_amount,
        discount_amount,
        grand_total,
        notes,
        terms,
        created_by,
        sales_quotation_items: {
          create: items.map((item) => ({
            item_id: item.item_id,
            qty: item.qty,
            rate: item.rate,
            tax_percent: item.tax_percent,
            discount: item.discount,
            amount: item.amount,
          })),
        },
      },
      include: { sales_quotation_items: true },
    });

    res.status(201).json({
      message: "Quotation created successfully",
      quotation,
    });
  } catch (err) {
    console.error("❌ Error creating quotation:", err);
    res.status(500).json({
      message: "Error creating quotation",
      error: err.message,
    });
  }
};
