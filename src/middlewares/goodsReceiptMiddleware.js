/**
 * Goods Receipt Middleware
 * Validates required fields and data types before processing goods receipt operations.
 */

const validateGoodsReceipt = (req, res, next) => {
  const {
    company_id,
    purchase_order_id,
    grn_no,
    receipt_date,
    warehouse_id,
  } = req.body;

  // Check if required fields are present
  if (!company_id || !purchase_order_id || !grn_no || !receipt_date || !warehouse_id) {
    return res.status(400).json({
      error: 'Missing required fields: company_id, purchase_order_id, grn_no, receipt_date, warehouse_id',
    });
  }

  // Validate company_id, purchase_order_id, warehouse_id are valid numbers (BigInt)
  if (isNaN(company_id) || isNaN(purchase_order_id) || isNaN(warehouse_id)) {
    return res.status(400).json({
      error: 'company_id, purchase_order_id, and warehouse_id must be valid numbers.',
    });
  }

  // Validate GRN No (string, non-empty)
  if (typeof grn_no !== 'string' || grn_no.trim() === '') {
    return res.status(400).json({
      error: 'grn_no must be a non-empty string.',
    });
  }

  // Validate date format (YYYY-MM-DD or ISO string)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(receipt_date)) {
    try {
      new Date(receipt_date); // Try to parse as ISO date
    } catch {
      return res.status(400).json({
        error: 'Invalid receipt_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
  }

  // Optional fields validation
  if (req.body.received_by !== undefined && typeof req.body.received_by !== 'string') {
    return res.status(400).json({
      error: 'received_by must be a string if provided.',
    });
  }

  if (req.body.signature_url !== undefined && typeof req.body.signature_url !== 'string') {
    return res.status(400).json({
      error: 'signature_url must be a string if provided.',
    });
  }

  if (req.body.photo_url !== undefined && typeof req.body.photo_url !== 'string') {
    return res.status(400).json({
      error: 'photo_url must be a string if provided.',
    });
  }

  if (req.body.status !== undefined && typeof req.body.status !== 'string') {
    return res.status(400).json({
      error: 'status must be a string if provided.',
    });
  }

  next();
};

export {
  validateGoodsReceipt,
};