// middleware/purchaseBillMiddleware.js

export const validatePurchaseBill = (req, res, next) => {
    const {
      company_id,
      vendor_id,
      bill_no,
      bill_date,
      due_date,
      total_amount,
      outstanding_amount,
      status,
      notes,
      terms_conditions,
      attachment_urls,
      created_by,
    } = req.body;
  
    if (!company_id || !vendor_id || !bill_no || !bill_date || !due_date || total_amount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: company_id, vendor_id, bill_no, bill_date, due_date, total_amount',
      });
    }
  
    if (isNaN(company_id) || isNaN(vendor_id)) {
      return res.status(400).json({
        error: 'company_id and vendor_id must be valid numbers.',
      });
    }
  
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
  
    if (!isValidDate(bill_date)) {
      return res.status(400).json({
        error: 'Invalid bill_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
    if (!isValidDate(due_date)) {
      return res.status(400).json({
        error: 'Invalid due_date format. Use YYYY-MM-DD or ISO date string.',
      });
    }
  
    if (isNaN(total_amount) || isNaN(outstanding_amount)) {
      return res.status(400).json({
        error: 'total_amount and outstanding_amount must be valid numbers.',
      });
    }
  
    const validStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }
  
    if (attachment_urls !== undefined) {
      try {
        const parsed = JSON.parse(attachment_urls);
        if (!Array.isArray(parsed)) {
          return res.status(400).json({
            error: 'attachment_urls must be a valid JSON array of strings.',
          });
        }
      } catch {
        return res.status(400).json({
          error: 'attachment_urls must be a valid JSON array.',
        });
      }
    }
  
    if (created_by && isNaN(created_by)) {
      return res.status(400).json({
        error: 'created_by must be a valid number if provided.',
      });
    }
  
    next();
  };