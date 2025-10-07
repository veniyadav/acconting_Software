// middleware/contraVoucherMiddleware.js

export const validateContraVoucher = (req, res, next) => {
    const {
      company_id,
      auto_voucher_no,
      manual_voucher_no,
      voucher_date,
      account_from_id,
      account_to_id,
      amount,
      upload_document,
      narration,
      status,
      created_by,
    } = req.body;
  
    // Required fields: company_id, account_from_id, account_to_id, amount
    if (!company_id || !account_from_id || !account_to_id || amount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, account_from_id, account_to_id, amount',
      });
    }
  
    // Validate company_id, account_from_id, account_to_id as numbers
    if (isNaN(company_id) || isNaN(account_from_id) || isNaN(account_to_id)) {
      return res.status(400).json({
        error: 'company_id, account_from_id, and account_to_id must be valid numbers.',
      });
    }
  
    // Validate date format
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
  
    if (voucher_date && !isValidDate(voucher_date)) {
      return res.status(400).json({
        error: 'Invalid voucher_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
  
    // Validate amount as number
    if (isNaN(amount)) {
      return res.status(400).json({
        error: 'amount must be a valid number.',
      });
    }
  
    // Validate status if provided
    const validStatuses = ['Draft', 'Submitted', 'Approved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    // Validate created_by if provided
    if (created_by && isNaN(created_by)) {
      return res.status(400).json({
        error: 'created_by must be a valid number if provided.',
      });
    }
  
    next();
  };