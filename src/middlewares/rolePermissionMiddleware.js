// middleware/rolePermissionMiddleware.js

export const validateRolePermission = (req, res, next) => {
  const { role_id, module_id, permission_id, granted } = req.body;

  // Required fields
  if (!role_id || !module_id || !permission_id) {
    return res.status(400).json({
      error: "Missing required fields: role_id, module_id, permission_id",
    });
  }

  // Numeric validation
  if (isNaN(role_id) || isNaN(module_id) || isNaN(permission_id)) {
    return res.status(400).json({
      error: "role_id, module_id, and permission_id must be valid numeric IDs.",
    });
  }

  // granted validation
  if (granted !== undefined && typeof granted !== "boolean" && granted !== "true" && granted !== "false") {
    return res.status(400).json({
      error: "granted must be a boolean value (true or false).",
    });
  }

  next();
};
