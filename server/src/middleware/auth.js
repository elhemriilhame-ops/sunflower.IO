const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect ─────────────────────────────────────────────────────────────────

/**
 * Verify JWT and attach the authenticated user to `req.user`.
 * Accepts the token from:
 *   1. Authorization header  → Bearer <token>
 *   2. Cookie                → token=<token>
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized – no token provided',
    });
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user document (without password) to the request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized – user not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized – token invalid or expired',
    });
  }
};

// ─── Authorize ───────────────────────────────────────────────────────────────

/**
 * Restrict access to specific roles.
 * Must be used AFTER the `protect` middleware.
 *
 * Usage:  router.delete('/:id', protect, authorize('admin'), handler)
 *
 * @param  {...string} roles  Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = { protect, authorize };
