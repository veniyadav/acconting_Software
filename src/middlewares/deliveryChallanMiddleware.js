// middleware/deliveryChallanMiddleware.js

export const validateDeliveryChallan = (req, res, next) => {
  const {
    company_id,
    order_id,
    challan_no,
    challan_date,
    driver_name,
    driver_phone,
    vehicle_no,
    total_amount,
    status,
    created_by,
  } = req.body;

  // Required fields
  if (!company_id || !order_id || !challan_no || !challan_date || total_amount === undefined) {
    return res.status(400).json({
      error:
        "Missing required fields: company_id, order_id, challan_no, challan_date, total_amount",
    });
  }

  // Validate numeric fields
  if (isNaN(company_id) || isNaN(order_id) || isNaN(total_amount)) {
    return res.status(400).json({
      error: "company_id, order_id, and total_amount must be valid numbers.",
    });
  }

  // Date validation
  const isValidDate = (dateStr) => {
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d);
  };

  if (!isValidDate(challan_date)) {
    return res.status(400).json({
      error: "Invalid challan_date format. Use YYYY-MM-DD or ISO string.",
    });
  }

  // Status validation
  const validStatuses = ["Draft", "Dispatched", "Delivered", "Returned"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
    });
  }

  // Phone validation (optional)
  if (driver_phone && !/^\d{10}$/.test(driver_phone)) {
    return res.status(400).json({
      error: "driver_phone must be a valid 10-digit number.",
    });
  }

  // created_by check
  if (created_by && isNaN(created_by)) {
    return res.status(400).json({
      error: "created_by must be a valid number if provided.",
    });
  }

  next();
};
