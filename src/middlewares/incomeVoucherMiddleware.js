// middleware/incomeVoucherMiddleware.js

export const validateIncomeVoucher = (req, res, next) => {
    const {
      company_id,
      auto_receipt_no,
      manual_receipt_no,
      voucher_date,
      deposited_to,
      received_from_id,
      total_amount,
      voucher_narration,
      status,
      created_by,
    } = req.body;
  
    // Required fields: company_id, received_from_id, total_amount
    if (!company_id || !received_from_id || total_amount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, received_from_id, total_amount',
      });
    }
  
    // Validate company_id and received_from_id as numbers
    if (isNaN(company_id) || isNaN(received_from_id)) {
      return res.status(400).json({
        error: 'company_id and received_from_id must be valid numbers.',
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
  
    // Validate total_amount as number
    if (isNaN(total_amount)) {
      return res.status(400).json({
        error: 'total_amount must be a valid number.',
      });
    }
  
    // Validate status if provided
    const validStatuses = ['Draft', 'Submitted', 'Approved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    // Validate deposited_to if provided
    const validDepositedTo = [
      'Cash',
      'Bank_Account',
      'Credit_Card',
      'Online_Payment'
    ];
    if (deposited_to && !validDepositedTo.includes(deposited_to)) {
      return res.status(400).json({
        error: `Invalid deposited_to. Allowed values: ${validDepositedTo.join(', ')}`,
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