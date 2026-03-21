const User      = require('../models/User');
const Pepiniere = require('../models/Pepiniere');
const Article   = require('../models/Article');
const Product   = require('../models/Product');
const fs        = require('fs');
const path      = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Helper: remove image file from disk
const removeImageFile = (imagePath) => {
  if (!imagePath) return;
  const abs = path.join(__dirname, '../../', imagePath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

// ══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: users.length, data: users });
});

/**
 * @desc    Get a single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Admin
 */
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Change a user's role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Admin
 */
const changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const allowedRoles = ['admin', 'user', 'client', 'delivery', 'pepiniere_owner'];

  if (!role || !allowedRoles.includes(role)) {
    return next(new ErrorResponse(`Invalid role. Must be one of: ${allowedRoles.join(', ')}`, 400));
  }

  // Prevent an admin from demoting themselves
  if (req.params.id === req.user.id.toString() && role !== 'admin') {
    return next(new ErrorResponse('You cannot change your own role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `User role updated to '${role}'`,
    data: user,
  });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.params.id === req.user.id.toString()) {
    return next(new ErrorResponse('You cannot delete your own account', 400));
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// ══════════════════════════════════════════════════════════════════════════════
// PEPINIERE APPLICATION MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all pepiniere applications
 * @route   GET /api/admin/pepinieres
 * @access  Admin
 */
const getAllPepiniereApplications = asyncHandler(async (req, res, next) => {
  const filter = req.query.status ? { status: req.query.status } : {};

  const applications = await Pepiniere.find(filter)
    .populate('userId', 'name email phone role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data:  applications,
  });
});

/**
 * @desc    Approve a pepiniere application
 * @route   PATCH /api/admin/pepinieres/:id/approve
 * @access  Admin
 */
const approveApplication = asyncHandler(async (req, res, next) => {
  let pepiniere = await Pepiniere.findById(req.params.id);
  
  if (!pepiniere) {
    return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
  }
  
  if (pepiniere.status === 'approved') {
    return next(new ErrorResponse('Application already approved', 400));
  }

  pepiniere.status = 'approved';
  await pepiniere.save();

  await User.findByIdAndUpdate(pepiniere.userId, { role: 'pepiniere_owner' });

  res.status(200).json({
    success: true,
    message: 'Application approved. User role updated to pepiniere_owner.',
    data:    pepiniere,
  });
});

/**
 * @desc    Reject a pepiniere application
 * @route   PATCH /api/admin/pepinieres/:id/reject
 * @access  Admin
 */
const rejectApplication = asyncHandler(async (req, res, next) => {
  const pepiniere = await Pepiniere.findById(req.params.id);
  
  if (!pepiniere) {
    return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
  }
  
  if (pepiniere.status === 'rejected') {
    return next(new ErrorResponse('Application already rejected', 400));
  }

  pepiniere.status = 'rejected';
  await pepiniere.save();

  res.status(200).json({
    success: true,
    message: 'Application rejected.',
    data:    pepiniere,
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT (Admin)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all products
 * @route   GET /api/admin/products
 * @access  Admin
 */
const adminGetAllProducts = asyncHandler(async (req, res, next) => {
  const filter = req.query.pepiniereId ? { pepiniereId: req.query.pepiniereId } : {};

  const products = await Product.find(filter)
    .populate('pepiniereId', 'proprietaryName location')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, data: products });
});

/**
 * @desc    Create a product
 * @route   POST /api/admin/products
 * @access  Admin
 */
const adminCreateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, pepiniereId } = req.body;

  if (!pepiniereId) {
    return next(new ErrorResponse('pepiniereId is required', 400));
  }

  const image = req.file ? `/uploads/products/${req.file.filename}` : undefined;

  const product = await Product.create({ name, description, price, stock, image, pepiniereId });

  res.status(201).json({ success: true, data: product });
});

/**
 * @desc    Update any product
 * @route   PUT /api/admin/products/:id
 * @access  Admin
 */
const adminUpdateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  const updates = { ...req.body };

  if (req.file) {
    removeImageFile(product.image);
    updates.image = `/uploads/products/${req.file.filename}`;
  }

  // Preserve existing values for missing keys
  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

  product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new:           true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete any product
 * @route   DELETE /api/admin/products/:id
 * @access  Admin
 */
const adminDeleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  removeImageFile(product.image);
  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getAllUsers,
  getUserById,
  changeUserRole,
  deleteUser,
  getAllPepiniereApplications,
  approveApplication,
  rejectApplication,
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
};
