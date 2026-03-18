const express = require('express');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const upload                 = require('../utils/uploadProductImage');

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────────────

router.get('/',    getAllProducts);
router.get('/:id', getProductById);

// ─── Pepiniere Owner Routes ───────────────────────────────────────────────────

router.post(
  '/',
  protect,
  authorize('pepiniere_owner', 'admin'),
  upload.single('image'),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('pepiniere_owner', 'admin'),
  upload.single('image'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('pepiniere_owner', 'admin'),
  deleteProduct
);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = router;
