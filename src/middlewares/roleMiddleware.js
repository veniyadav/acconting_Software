// middleware/roleMiddleware.js

export const validateRole = (req, res, next) => {
  const { role_name, role_type, status } = req.body;

  // Required: role_name
  if (!role_name || typeof role_name !== "string" || role_name.trim() === "") {
    return res.status(400).json({
      error: "role_name is required and must be a non-empty string.",
    });
  }

  // Length check
  if (role_name.length > 100) {
    return res.status(400).json({
      error: "role_name cannot exceed 100 characters.",
    });
  }

  // role_type validation
  const validRoleTypes = ["User", "System"];
  if (!role_type || !validRoleTypes.includes(role_type)) {
    return res.status(400).json({
      error: `Invalid role_type. Allowed values: ${validRoleTypes.join(", ")}`,
    });
  }

  // status validation
  const validStatuses = ["Active", "Inactive"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
    });
  }

  next();
};
