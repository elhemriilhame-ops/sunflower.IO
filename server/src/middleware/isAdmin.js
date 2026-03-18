const { protect, authorize } = require('./auth');

/**
 * Convenience middleware stack that:
 *  1. Verifies the JWT and attaches req.user  (protect)
 *  2. Ensures the caller has the 'admin' role  (authorize)
 *
 * Usage:
 *   const isAdmin = require('../middleware/isAdmin');
 *   router.get('/users', ...isAdmin, handler);
 */
const isAdmin = [protect, authorize('admin')];

module.exports = isAdmin;
