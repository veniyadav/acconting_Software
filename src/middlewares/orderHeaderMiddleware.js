// middleware/orderHeaderMiddleware.js

export const validateOrderHeader = (req, res, next) => {
    const {
      company_id,
      order_type,
      customer_id,
      vendor_id,
      order_no,
      manual_order_no,
      order_date,
      sub_total,
      total_tax,
      total_discount,
      grand_total,
      notes,
      terms_conditions,
      bank_name,
      account_number,
      account_holder,
      ifsc_code,
      status,
      created_by,
    } = req.body;
  
    // Required fields
    if (!company_id || !order_type || !order_no || !order_date || sub_total === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, order_type, order_no, order_date, sub_total',
      });
    }
  
    // Validate company_id, customer_id, vendor_id, created_by are numbers
    if (isNaN(company_id)) {
      return res.status(400).json({ error: 'company_id must be a valid number.' });
    }
    if (customer_id && isNaN(customer_id)) {
      return res.status(400).json({ error: 'customer_id must be a valid number.' });
    }
    if (vendor_id && isNaN(vendor_id)) {
      return res.status(400).json({ error: 'vendor_id must be a valid number.' });
    }
    if (created_by && isNaN(created_by)) {
      return res.status(400).json({ error: 'created_by must be a valid number.' });
    }
  
    // Validate order_type
    const validOrderTypes = ['sales', 'purchase'];
    if (!validOrderTypes.includes(order_type)) {
      return res.status(400).json({
        error: `Invalid order_type. Allowed values: ${validOrderTypes.join(', ')}`,
      });
    }
  
    // Validate dates
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
  
    if (!isValidDate(order_date)) {
      return res.status(400).json({
        error: 'Invalid order_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
  
    // Validate amounts
    if (isNaN(sub_total) || isNaN(total_tax) || isNaN(total_discount) || isNaN(grand_total)) {
      return res.status(400).json({
        error: 'sub_total, total_tax, total_discount, and grand_total must be valid numbers.',
      });
    }
  
    // Validate status
    const validStatuses = ['draft', 'pending', 'confirmed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    next();
  };