const express = require('express');

const {
  applyForPepiniere,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
} = require('../controllers/pepiniereController');

const { protect, authorize } = require('../middleware/auth');
const upload                 = require('../utils/uploadCertificates');
const { pepiniereValidation } = require('../middleware/validate');

const router = express.Router();

// ─── User Routes ─────────────────────────────────────────────────────────────

// Submit an application with up to 5 certificate files
router.post(
  '/apply',
  protect,
  upload.array('certificates', 5),
  pepiniereValidation,
  applyForPepiniere
);

// View own application status
router.get('/my-application', protect, getMyApplication);

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// List all applications  →  GET /api/pepinieres?status=pending
router.get('/', protect, authorize('admin'), getAllApplications);

// Get a single application
router.get('/:id', protect, authorize('admin'), getApplicationById);

// Approve an application
router.patch('/:id/approve', protect, authorize('admin'), approveApplication);

// Reject an application
router.patch('/:id/reject', protect, authorize('admin'), rejectApplication);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = router;
