// middleware/voucherMiddleware.js

export const validateVoucher = (req, res, next) => {
    const {
      company_id,
      voucher_type,
      company_name,
      company_logo,
      from_customer_id,
      to_name,
      receipt_number,
      voucher_number,
      voucher_date,
      subtotal,
      total,
      notes,
      created_by,
    } = req.body;
  
    // Required fields: company_id, voucher_type
    if (!company_id || !voucher_type) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, voucher_type',
      });
    }
  
    // Validate company_id as number
    if (isNaN(company_id)) {
      return res.status(400).json({
        error: 'company_id must be a valid number.',
      });
    }
  
    // Validate voucher_type against enum
    const validVoucherTypes = [
      'Expense',
      'Income',
      'Contra',
      'Journal',
      'Credit_Note',
      'Debit_Note',
      'Opening_Balance',
      'Current_Balance',
      'Closing_Balance',
      'Sales',
      'Purchase',
      'Delivery_Challans'
    ];
    if (!validVoucherTypes.includes(voucher_type)) {
      return res.status(400).json({
        error: `Invalid voucher_type. Allowed values: ${validVoucherTypes.join(', ')}`,
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
  
    // Validate subtotal and total as numbers
    if (subtotal !== undefined && isNaN(subtotal)) {
      return res.status(400).json({
        error: 'subtotal must be a valid number if provided.',
      });
    }
    if (total !== undefined && isNaN(total)) {
      return res.status(400).json({
        error: 'total must be a valid number if provided.',
      });
    }
  
    // Validate from_customer_id if provided
    if (from_customer_id && isNaN(from_customer_id)) {
      return res.status(400).json({
        error: 'from_customer_id must be a valid number if provided.',
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