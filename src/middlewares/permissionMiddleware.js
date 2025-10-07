// middleware/permissionMiddleware.js

export const validatePermission = (req, res, next) => {
  const { name, description } = req.body;

  // Required name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Permission 'name' is required and must be a non-empty string.",
    });
  }

  // Length check for name
  if (name.length > 100) {
    return res.status(400).json({
      error: "Permission 'name' cannot exceed 100 characters.",
    });
  }

  // Optional description
  if (description && typeof description !== "string") {
    return res.status(400).json({
      error: "Permission 'description' must be a string if provided.",
    });
  }

  // Optional whitelist for standard permission names
  const allowedNames = ["Create", "View", "Update", "Delete", "FullAccess"];
  if (!allowedNames.includes(name)) {
    return res.status(400).json({
      error: `Invalid permission name. Allowed values: ${allowedNames.join(", ")}`,
    });
  }

  next();
};
