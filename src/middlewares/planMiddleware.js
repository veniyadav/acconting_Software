// middleware/planMiddleware.js

export const validatePlan = (req, res, next) => {
  const {
    plan_name,
    currency,
    base_price,
    total_price,
    invoice_limit,
    user_limit,
    storage_capacity,
    billing_cycle,
    status,
  } = req.body;

  // Required fields
  if (
    !plan_name ||
    !currency ||
    base_price === undefined ||
    total_price === undefined ||
    !invoice_limit ||
    !user_limit ||
    !storage_capacity ||
    !billing_cycle
  ) {
    return res.status(400).json({
      error:
        "Missing required fields: plan_name, currency, base_price, total_price, invoice_limit, user_limit, storage_capacity, billing_cycle",
    });
  }

  // Field validations
  if (typeof plan_name !== "string" || plan_name.trim() === "") {
    return res.status(400).json({ error: "plan_name must be a non-empty string." });
  }

  if (!/^[A-Z]{3}$/.test(currency)) {
    return res.status(400).json({ error: "currency must be a valid 3-letter code (e.g., USD, INR)." });
  }

  if (isNaN(base_price) || isNaN(total_price)) {
    return res.status(400).json({ error: "base_price and total_price must be valid numbers." });
  }

  if (isNaN(invoice_limit) || isNaN(user_limit)) {
    return res.status(400).json({ error: "invoice_limit and user_limit must be valid integers." });
  }

  const validBillingCycles = ["Monthly", "Yearly"];
  if (!validBillingCycles.includes(billing_cycle)) {
    return res.status(400).json({
      error: `Invalid billing_cycle. Allowed values: ${validBillingCycles.join(", ")}`,
    });
  }

  const validStatuses = ["Active", "Inactive"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
    });
  }

  next();
};
