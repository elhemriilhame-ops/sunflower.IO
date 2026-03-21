const express = require('express');
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/uploadArticleImage');
const { articleValidation } = require('../middleware/validate');

const router = express.Router();

// ─── Public routes ───────────────────────────────────────────────────────────

router.get('/', getAllArticles);
router.get('/:id', getArticleById);

// ─── Admin routes ────────────────────────────────────────────────────────────

router.post(
  '/', 
  protect, 
  authorize('admin'), 
  upload.single('image'), 
  articleValidation,
  createArticle
);

router.put(
  '/:id', 
  protect, 
  authorize('admin'), 
  upload.single('image'), 
  articleValidation,
  updateArticle
);

router.delete('/:id', protect, authorize('admin'), deleteArticle);

module.exports = router;
