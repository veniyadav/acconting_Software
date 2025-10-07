// middleware/vendorPaymentMiddleware.js

export const validateVendorPayment = (req, res, next) => {
    const {
      company_id,
      auto_payment_no,
      manual_payment_no,
      voucher_date,
      paid_from,
      paid_to_id,
      upload_document,
      payment_mode,
      sub_total,
      total_amount,
      narration,
      status,
      created_by,
    } = req.body;
  
    // Required fields
    if (!company_id || !auto_payment_no || !voucher_date || sub_total === undefined || total_amount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, auto_payment_no, voucher_date, sub_total, total_amount',
      });
    }
  
    // Validate numbers
    if (isNaN(company_id)) {
      return res.status(400).json({ error: 'company_id must be a valid number.' });
    }
    if (isNaN(paid_to_id)) {
      return res.status(400).json({ error: 'paid_to_id must be a valid number.' });
    }
    if (created_by && isNaN(created_by)) {
      return res.status(400).json({ error: 'created_by must be a valid number if provided.' });
    }
  
    // Validate voucher_date
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
  
    if (!isValidDate(voucher_date)) {
      return res.status(400).json({
        error: 'Invalid voucher_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
  
    // Validate amounts
    if (isNaN(sub_total) || isNaN(total_amount)) {
      return res.status(400).json({
        error: 'sub_total and total_amount must be valid numbers.',
      });
    }
  
    // Validate payment_mode
    const validPaymentModes = ['cash', 'bank', 'upi', 'cheque'];
    if (!validPaymentModes.includes(payment_mode)) {
      return res.status(400).json({
        error: `Invalid payment_mode. Allowed values: ${validPaymentModes.join(', ')}`,
      });
    }
  
    // Validate status
    const validStatuses = ['draft', 'paid', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    // Validate upload_document (if provided)
    if (upload_document !== undefined) {
      try {
        const parsed = JSON.parse(upload_document);
        if (!Array.isArray(parsed)) {
          return res.status(400).json({
            error: 'upload_document must be a valid JSON array of strings.',
          });
        }
      } catch {
        return res.status(400).json({
          error: 'upload_document must be a valid JSON array.',
        });
      }
    }
  
    next();
  };