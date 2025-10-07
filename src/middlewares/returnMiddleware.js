// middleware/returnMiddleware.js

export const validateReturn = (req, res, next) => {
    const {
      return_no,
      reference_no,
      invoice_no,
      return_date,
      return_type,
      customer_id,
      vendor_id,
      warehouse_id,
      reason,
      status,
    } = req.body;
  
    // Required fields
    if (!return_no || !invoice_no || !return_date || !return_type || !warehouse_id || !reason) {
      return res.status(400).json({
        error: 'Missing required fields: return_no, invoice_no, return_date, return_type, warehouse_id, reason',
      });
    }
  
    // Validate IDs
    if (customer_id && isNaN(customer_id)) {
      return res.status(400).json({ error: 'customer_id must be a valid number.' });
    }
    if (vendor_id && isNaN(vendor_id)) {
      return res.status(400).json({ error: 'vendor_id must be a valid number.' });
    }
    if (isNaN(warehouse_id)) {
      return res.status(400).json({ error: 'warehouse_id must be a valid number.' });
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
        error: 'Invalid return_date format. Use YYYY-MM-DD.',
      });
    }
  
    // Validate return_type enum
    const validReturnTypes = ['Sales', 'Purchase'];
    if (!validReturnTypes.includes(return_type)) {
      return res.status(400).json({
        error: `Invalid return_type. Allowed values: ${validReturnTypes.join(', ')}`,
      });
    }
  
    // Validate status enum
    const validStatuses = ['Open', 'Processed', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    next();
  };