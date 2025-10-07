// ✅ userMiddleware.js

export const validateUser = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, and password',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const validRoles = ['Admin', 'Accountant', 'Manager', 'User'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      error: 'Invalid role. Must be one of: ' + validRoles.join(', '),
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long',
    });
  }

  next();
};
