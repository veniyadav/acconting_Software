const validateBankDetails = (req, res, next) => {
  const {
    bank_name,
    account_no,
    account_holder,
    ifsc_code,
    notes,
    vendorId, // optional, agar vendor se linked ho
  } = req.body;

  // Required fields
  if (!bank_name || typeof bank_name !== 'string' || bank_name.trim().length === 0) {
    return res.status(400).json({ error: 'bank_name is required and must be a non-empty string' });
  }

  if (!account_no || typeof account_no !== 'string' || account_no.trim().length === 0) {
    return res.status(400).json({ error: 'account_no is required and must be a non-empty string' });
  }

  if (!account_holder || typeof account_holder !== 'string' || account_holder.trim().length === 0) {
    return res.status(400).json({ error: 'account_holder is required and must be a non-empty string' });
  }

  if (!ifsc_code || typeof ifsc_code !== 'string' || !/^[A-Za-z]{4}\d{7}$/.test(ifsc_code)) {
    return res.status(400).json({ error: 'ifsc_code is required and must be in valid format (e.g., SBIN0002499)' });
  }

  // Optional: Validate vendorId if provided
  if (vendorId && isNaN(vendorId)) {
    return res.status(400).json({ error: 'vendorId must be a valid number' });
  }

  // Optional: Validate notes length
  if (notes && typeof notes !== 'string') {
    return res.status(400).json({ error: 'notes must be a string' });
  }

  next();
};

export {
  validateBankDetails,
};