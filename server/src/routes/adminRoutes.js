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

} = require('../controllers/adminController');

const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// All routes below are protected by the isAdmin middleware stack
// (protect JWT + authorize 'admin')

// ─── Users ────────────────────────────────────────────────────────────────────

router.get   ('/users',           ...isAdmin, getAllUsers);
router.get   ('/users/:id',       ...isAdmin, getUserById);
router.patch ('/users/:id/role',  ...isAdmin, changeUserRole);
router.delete('/users/:id',       ...isAdmin, deleteUser);

// ─── Pepiniere Applications ───────────────────────────────────────────────────

// GET /api/admin/pepinieres?status=pending
router.get  ('/pepinieres',             ...isAdmin, getAllPepiniereApplications);
router.patch('/pepinieres/:id/approve', ...isAdmin, approveApplication);
router.patch('/pepinieres/:id/reject',  ...isAdmin, rejectApplication);


// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = router;
