// middleware/requestedPlanMiddleware.js

export const validateRequestedPlan = (req, res, next) => {
  const { company_id, plan_id, billing, request_date, status } = req.body;

  // Required fields
  if (!company_id || !plan_id || !billing || !request_date) {
    return res.status(400).json({
      error:
        "Missing required fields: company_id, plan_id, billing, request_date",
    });
  }

  // Numeric validation
  if (isNaN(company_id) || isNaN(plan_id)) {
    return res.status(400).json({
      error: "company_id and plan_id must be valid numeric values.",
    });
  }

  // Billing validation
  const validBilling = ["Monthly", "Yearly"];
  if (!validBilling.includes(billing)) {
    return res.status(400).json({
      error: `Invalid billing type. Allowed values: ${validBilling.join(", ")}`,
    });
  }

  // Status validation
  const validStatuses = ["Pending", "Approved", "Rejected"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
    });
  }

  // Date validation
  const isValidDate = (dateStr) => {
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d);
  };
  if (!isValidDate(request_date)) {
    return res.status(400).json({
      error: "Invalid request_date format. Use YYYY-MM-DD or ISO date string.",
    });
  }

  next();
};
