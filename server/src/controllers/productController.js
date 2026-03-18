const Product   = require('../models/Product');
const Pepiniere = require('../models/Pepiniere');
const fs        = require('fs');
const path      = require('path');

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Find the approved pepiniere that belongs to the logged-in user.
 * Returns null if not found.
 */
const getOwnerPepiniere = async (userId) => {
  return Pepiniere.findOne({ userId, status: 'approved' });
};

/**
 * Delete a product image file from disk (best-effort, no crash if missing).
 */
const removeImageFile = (imagePath) => {
  if (!imagePath) return;
  const abs = path.join(__dirname, '../../', imagePath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

// ─── Public Controllers ───────────────────────────────────────────────────────

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const filter = {};

    // Optional filters via query params
    if (req.query.pepiniereId) filter.pepiniereId = req.query.pepiniereId;
    if (req.query.minPrice)     filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice)     filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };

    const products = await Product.find(filter)
      .populate('pepiniereId', 'proprietaryName location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'pepiniereId',
      'proprietaryName location email phone'
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Pepiniere Owner Controllers ──────────────────────────────────────────────

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private / pepiniere_owner
 */
const createProduct = async (req, res) => {
  try {
    const pepiniere = await getOwnerPepiniere(req.user.id);
    if (!pepiniere) {
      return res.status(403).json({
        success: false,
        message: 'You must have an approved pepiniere to add products',
      });
    }

    const { name, description, price, stock } = req.body;

    // Build image URL if a file was uploaded
    const image = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      image,
      pepiniereId: pepiniere._id,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private / pepiniere_owner (own products only)
 */
const updateProduct = async (req, res) => {
  try {
    const pepiniere = await getOwnerPepiniere(req.user.id);
    if (!pepiniere) {
      return res.status(403).json({
        success: false,
        message: 'You must have an approved pepiniere to manage products',
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ownership check
    if (product.pepiniereId.toString() !== pepiniere._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product',
      });
    }

    const { name, description, price, stock } = req.body;
    const updates = { name, description, price, stock };

    // If a new image was uploaded, replace the old one
    if (req.file) {
      removeImageFile(product.image);
      updates.image = `/uploads/products/${req.file.filename}`;
    }

    // Remove undefined keys so existing values aren't wiped
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new:          true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private / pepiniere_owner (own products only)
 */
const deleteProduct = async (req, res) => {
  try {
    const pepiniere = await getOwnerPepiniere(req.user.id);
    if (!pepiniere) {
      return res.status(403).json({
        success: false,
        message: 'You must have an approved pepiniere to manage products',
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ownership check
    if (product.pepiniereId.toString() !== pepiniere._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product',
      });
    }

    // Remove image from disk then delete document
    removeImageFile(product.image);
    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
