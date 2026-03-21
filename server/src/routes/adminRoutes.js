const express = require('express');

const {
  // Users
  getAllUsers,
  getUserById,
  changeUserRole,
  deleteUser,
  // Pepinieres
  getAllPepiniereApplications,
  approveApplication,
  rejectApplication,
  // Products
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} = require('../controllers/adminController');

const isAdmin = require('../middleware/isAdmin');
const upload  = require('../utils/uploadProductImage');
const { productValidation } = require('../middleware/validate');

const router = express.Router();

// All routes below are protected by the isAdmin middleware stack
// (protect JWT + authorize 'admin')

// ─── Users ────────────────────────────────────────────────────────────────────

router.get   ('/users',           ...isAdmin, getAllUsers);
router.get   ('/users/:id',       ...isAdmin, getUserById);
router.patch ('/users/:id/role',  ...isAdmin, changeUserRole);
router.delete('/users/:id',       ...isAdmin, deleteUser);

// ─── Pepiniere Applications ───────────────────────────────────────────────────

router.get  ('/pepinieres',             ...isAdmin, getAllPepiniereApplications);
router.patch('/pepinieres/:id/approve', ...isAdmin, approveApplication);
router.patch('/pepinieres/:id/reject',  ...isAdmin, rejectApplication);

// ─── Products (Admin Overrides) ───────────────────────────────────────────────

router.get   ('/products',     ...isAdmin, adminGetAllProducts);
router.post  ('/products',     ...isAdmin, upload.single('image'), productValidation, adminCreateProduct);
router.put   ('/products/:id', ...isAdmin, upload.single('image'), productValidation, adminUpdateProduct);
router.delete('/products/:id', ...isAdmin, adminDeleteProduct);


// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = router;
