// middleware/salesReturnMiddleware.js

export const validateSalesReturn = (req, res, next) => {
  const {
    company_id,
    reference_id,
    manual_voucher_no,
    auto_voucher_no,
    return_no,
    invoice_id,
    customer_id,
    warehouse_id,
    return_date,
    return_type,
    reason_for_return,
    total_items,
    total_value,
    status,
    created_by,
  } = req.body;

  // Required fields
  if (!company_id || !return_date || !return_type || !reason_for_return) {
    return res.status(400).json({
      error: 'Missing required fields: company_id, return_date, return_type, reason_for_return',
    });
  }

  // Validate numbers
  if (isNaN(company_id)) {
    return res.status(400).json({ error: 'company_id must be a valid number.' });
  }
  if (invoice_id && isNaN(invoice_id)) {
    return res.status(400).json({ error: 'invoice_id must be a valid number.' });
  }
  if (customer_id && isNaN(customer_id)) {
    return res.status(400).json({ error: 'customer_id must be a valid number.' });
  }
  if (warehouse_id && isNaN(warehouse_id)) {
    return res.status(400).json({ error: 'warehouse_id must be a valid number.' });
  }
  if (created_by && isNaN(created_by)) {
    return res.status(400).json({ error: 'created_by must be a valid number if provided.' });
  }

  // Validate date
  const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(dateStr)) return true;
    try {
      const d = new Date(dateStr);
      return d instanceof Date && !isNaN(d);
    } catch {
      return false;
    }
  };

  if (!isValidDate(return_date)) {
    return res.status(400).json({
      error: 'Invalid return_date format. Use YYYY-MM-DD or ISO date string.',
    });
  }

  // Validate return_type enum
  const validReturnTypes = ['Sales_Return', 'Replacement', 'Other'];
  if (!validReturnTypes.includes(return_type)) {
    return res.status(400).json({
      error: `Invalid return_type. Allowed values: ${validReturnTypes.join(', ')}`,
    });
  }

  // Validate status enum
  const validStatuses = ['Draft', 'Pending_Inspection', 'Approved', 'Rejected', 'Completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
    });
  }

  // Validate total_items (if provided)
  if (total_items !== undefined && isNaN(total_items)) {
    return res.status(400).json({
      error: 'total_items must be a valid integer if provided.',
    });
  }

  // Validate total_value (if provided)
  if (total_value !== undefined && isNaN(total_value)) {
    return res.status(400).json({
      error: 'total_value must be a valid number if provided.',
    });
  }

  next();
};