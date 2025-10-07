// middleware/expenseVoucherMiddleware.js

export const validateExpenseVoucher = (req, res, next) => {
    const {
      company_id,
      auto_receipt_no,
      manual_receipt_no,
      voucher_date,
      paid_from,
      paid_to_account_id,
      total_amount,
      voucher_narration,
      status,
      created_by,
    } = req.body;
  
    // Required fields
    if (!company_id || !voucher_date || !paid_from || total_amount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, voucher_date, paid_from, total_amount',
      });
    }
  
    // Validate company_id & paid_to_account_id are valid numbers
    if (isNaN(company_id)) {
      return res.status(400).json({ error: 'company_id must be a valid number.' });
    }
    if (paid_to_account_id && isNaN(paid_to_account_id)) {
      return res.status(400).json({ error: 'paid_to_account_id must be a valid number.' });
    }
    if (created_by && isNaN(created_by)) {
      return res.status(400).json({ error: 'created_by must be a valid number if provided.' });
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
  
    if (!isValidDate(voucher_date)) {
      return res.status(400).json({
        error: 'Invalid voucher_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
  
    // Validate amounts
    if (isNaN(total_amount)) {
      return res.status(400).json({
        error: 'total_amount must be a valid number.',
      });
    }
  
    // Validate paid_from enum
    const validPaidFrom = ['Cash', 'Bank_Transfer', 'Credit_Card', 'Paypal'];
    if (!validPaidFrom.includes(paid_from)) {
      return res.status(400).json({
        error: `Invalid paid_from. Allowed values: ${validPaidFrom.join(', ')}`,
      });
    }
  
    // Validate status enum
    const validStatuses = ['Draft', 'Submitted', 'Approved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    next();
  };