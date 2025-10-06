import pool from "../config/db.js";

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
      items = []
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO sales_quotations 
       (company_id, customer_id, quotation_no, manual_ref_no, quotation_date, valid_till, 
        total_amount, tax_amount, discount_amount, grand_total, notes, terms, status, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [company_id, customer_id, quotation_no, manual_ref_no, quotation_date, valid_till,
       total_amount, tax_amount, discount_amount, grand_total, notes, terms, 'Draft', created_by]
    );

    const quotationId = result.insertId;

    for (const item of items) {
      await pool.query(
        `INSERT INTO sales_quotation_items (quotation_id, item_id, qty, rate, tax_percent, discount, amount)
         VALUES (?,?,?,?,?,?,?)`,
        [quotationId, item.item_id, item.qty, item.rate, item.tax_percent, item.discount, item.amount]
      );
    }

    res.status(201).json({ success: true, quotation_id: quotationId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuotations = async (_, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT q.*, a.name AS customer_name
       FROM sales_quotations q
       LEFT JOIN accounts a ON q.customer_id = a.id
       ORDER BY q.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[quotation]] = await pool.query(`SELECT * FROM sales_quotations WHERE id=?`, [id]);
    const [items] = await pool.query(`SELECT * FROM sales_quotation_items WHERE quotation_id=?`, [id]);
    res.json({ ...quotation, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};