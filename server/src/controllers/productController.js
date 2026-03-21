const Product   = require('../models/Product');
const Pepiniere = require('../models/Pepiniere');
const fs        = require('fs');
const path      = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Find the approved pepiniere that belongs to the logged-in user.
 */
const getOwnerPepiniere = async (userId) => {
  return Pepiniere.findOne({ userId, status: 'approved' });
};

/**
 * Delete a product image file from disk.
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
const getAllProducts = asyncHandler(async (req, res, next) => {
  const filter = {};

  if (req.query.pepiniereId) filter.pepiniereId = req.query.pepiniereId;
  if (req.query.minPrice)     filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
  if (req.query.maxPrice)     filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };

  const products = await Product.find(filter)
    .populate('pepiniereId', 'proprietaryName location')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, data: products });
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    'pepiniereId',
    'proprietaryName location email phone'
  );

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: product });
});

// ─── Pepiniere Owner Controllers ──────────────────────────────────────────────

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private / pepiniere_owner
 */
const createProduct = asyncHandler(async (req, res, next) => {
  const pepiniere = await getOwnerPepiniere(req.user.id);
  if (!pepiniere) {
    return next(new ErrorResponse('You must have an approved pepiniere to add products', 403));
  }

  const { name, description, price, stock } = req.body;
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
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private / pepiniere_owner
 */
const updateProduct = asyncHandler(async (req, res, next) => {
  const pepiniere = await getOwnerPepiniere(req.user.id);
  if (!pepiniere) {
    return next(new ErrorResponse('You must have an approved pepiniere to manage products', 403));
  }

  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Ownership check
  if (product.pepiniereId.toString() !== pepiniere._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this product', 403));
  }

  const updates = { ...req.body };

  if (req.file) {
    removeImageFile(product.image);
    updates.image = `/uploads/products/${req.file.filename}`;
  }

  // Prevent overwriting if values are missing in partial update
  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

  product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private / pepiniere_owner
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
  const pepiniere = await getOwnerPepiniere(req.user.id);
  if (!pepiniere) {
    return next(new ErrorResponse('You must have an approved pepiniere to manage products', 403));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Ownership check
  if (product.pepiniereId.toString() !== pepiniere._id.toString()) {
    return next(new ErrorResponse('Not authorized to delete this product', 403));
  }

  removeImageFile(product.image);
  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
