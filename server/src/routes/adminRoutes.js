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
  // Articles
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
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

// ─── Articles ─────────────────────────────────────────────────────────────────

router.get   ('/articles',     ...isAdmin, getAllArticles);
router.post  ('/articles',     ...isAdmin, createArticle);
router.put   ('/articles/:id', ...isAdmin, updateArticle);
router.delete('/articles/:id', ...isAdmin, deleteArticle);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = router;
