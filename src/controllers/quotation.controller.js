import pool from "../config/db.js";

// ✅ Create Quotation
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

    const [result] = await pool.query(
      `INSERT INTO sales_quotations 
      (company_id, customer_id, quotation_no, manual_ref_no, quotation_date, valid_till, total_amount, tax_amount, discount_amount, grand_total, notes, terms, status, created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
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
        "Draft",
        created_by,
      ]
    );

    const quotationId = result.insertId;

    for (const item of items) {
      await pool.query(
        `INSERT INTO sales_quotation_items 
        (quotation_id, item_id, qty, rate, tax_percent, discount, amount)
        VALUES (?,?,?,?,?,?,?)`,
        [
          quotationId,
          item.item_id,
          item.qty,
          item.rate,
          item.tax_percent,
          item.discount,
          item.amount,
        ]
      );
    }

    res.status(201).json({ success: true, id: quotationId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Quotations
export const getAllQuotations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT q.*, a.name AS customer_name 
      FROM sales_quotations q
      LEFT JOIN accounts a ON q.customer_id = a.id
      ORDER BY q.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Single Quotation with Items
export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[quotation]] = await pool.query(
      `SELECT * FROM sales_quotations WHERE id=?`,
      [id]
    );
    const [items] = await pool.query(
      `SELECT * FROM sales_quotation_items WHERE quotation_id=?`,
      [id]
    );
    res.json({ ...quotation, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Quotation
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    await pool.query(`UPDATE sales_quotations SET ? WHERE id=?`, [fields, id]);
    res.json({ success: true, message: "Quotation updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Quotation
export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM sales_quotation_items WHERE quotation_id=?`, [id]);
    await pool.query(`DELETE FROM sales_quotations WHERE id=?`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};