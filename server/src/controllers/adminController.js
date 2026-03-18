const User      = require('../models/User');
const Pepiniere = require('../models/Pepiniere');
const Article   = require('../models/Article');
const Product   = require('../models/Product');
const fs        = require('fs');
const path      = require('path');

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
const getAllUsers = async (req, res) => {
  try {
    // Optional role filter: /api/admin/users?role=pepiniere_owner
    const filter = req.query.role ? { role: req.query.role } : {};

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get a single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Change a user's role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Admin
 */
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ['admin', 'user', 'client', 'delivery', 'pepiniere_owner'];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${allowedRoles.join(', ')}`,
      });
    }

    // Prevent an admin from demoting themselves
    if (req.params.id === req.user.id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}'`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// PEPINIERE APPLICATION MANAGEMENT
// (thin wrappers — detailed logic lives in pepiniereController)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all pepiniere applications with full user details
 * @route   GET /api/admin/pepinieres
 * @access  Admin
 */
const getAllPepiniereApplications = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};

    const applications = await Pepiniere.find(filter)
      .populate('userId', 'name email phone role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data:  applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Approve a pepiniere application + upgrade user role
 * @route   PATCH /api/admin/pepinieres/:id/approve
 * @access  Admin
 */
const approveApplication = async (req, res) => {
  try {
    const pepiniere = await Pepiniere.findById(req.params.id);
    if (!pepiniere) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (pepiniere.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Application already approved' });
    }

    pepiniere.status = 'approved';
    await pepiniere.save();

    await User.findByIdAndUpdate(pepiniere.userId, { role: 'pepiniere_owner' });

    res.status(200).json({
      success: true,
      message: 'Application approved. User role updated to pepiniere_owner.',
      data:    pepiniere,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject a pepiniere application
 * @route   PATCH /api/admin/pepinieres/:id/reject
 * @access  Admin
 */
const rejectApplication = async (req, res) => {
  try {
    const pepiniere = await Pepiniere.findById(req.params.id);
    if (!pepiniere) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (pepiniere.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Application already rejected' });
    }

    pepiniere.status = 'rejected';
    await pepiniere.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected.',
      data:    pepiniere,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// ARTICLE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all articles
 * @route   GET /api/admin/articles
 * @access  Admin
 */
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create an article
 * @route   POST /api/admin/articles
 * @access  Admin
 */
const createArticle = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const article = await Article.create({
      title,
      content,
      image,
      author: req.user.id, // Admin is the author
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an article
 * @route   PUT /api/admin/articles/:id
 * @access  Admin
 */
const updateArticle = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an article
 * @route   DELETE /api/admin/articles/:id
 * @access  Admin
 */
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT (admin — no ownership restriction)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all products
 * @route   GET /api/admin/products
 * @access  Admin
 */
const adminGetAllProducts = async (req, res) => {
  try {
    const filter = req.query.pepiniereId ? { pepiniereId: req.query.pepiniereId } : {};

    const products = await Product.find(filter)
      .populate('pepiniereId', 'proprietaryName location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a product (admin picks the pepiniere)
 * @route   POST /api/admin/products
 * @access  Admin
 */
const adminCreateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, pepiniereId } = req.body;

    if (!pepiniereId) {
      return res.status(400).json({ success: false, message: 'pepiniereId is required' });
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    const product = await Product.create({ name, description, price, stock, image, pepiniereId });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update any product
 * @route   PUT /api/admin/products/:id
 * @access  Admin
 */
const adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, stock, pepiniereId } = req.body;
    const updates = { name, description, price, stock, pepiniereId };

    if (req.file) {
      removeImageFile(product.image);
      updates.image = `/uploads/products/${req.file.filename}`;
    }

    // Strip undefined keys so existing values are preserved
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new:           true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete any product
 * @route   DELETE /api/admin/products/:id
 * @access  Admin
 */
const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    removeImageFile(product.image);
    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = {
  // Users
  getAllUsers,
  getUserById,
  changeUserRole,
  deleteUser,
  // Pepinieres
  getAllPepiniereApplications,
  approveApplication,
  rejectApplication,
  // Articles
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  // Products
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
};
