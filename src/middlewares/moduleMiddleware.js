// middleware/moduleMiddleware.js

export const validateModule = (req, res, next) => {
  const { module_name, description } = req.body;

  // Required: module_name
  if (!module_name || typeof module_name !== "string" || module_name.trim() === "") {
    return res.status(400).json({
      error: "module_name is required and must be a non-empty string.",
    });
  }

  // Length check
  if (module_name.length > 100) {
    return res.status(400).json({
      error: "module_name cannot exceed 100 characters.",
    });
  }

  // Optional description
  if (description && typeof description !== "string") {
    return res.status(400).json({
      error: "description must be a string if provided.",
    });
  }

  next();
};
