const Article = require('../models/Article');
const fs      = require('fs');
const path    = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Helper: remove image file from disk
const removeImageFile = (imagePath) => {
  if (!imagePath) return;
  const abs = path.join(__dirname, '../../', imagePath);
  if (fs.existsSync(abs)) {
    fs.unlink(abs, (err) => {
      if (err) console.error(`Error deleting image ${imagePath}:`, err);
    });
  }
};

/**
 * @desc    Get all articles
 * @route   GET /api/articles
 * @access  Public
 */
const getAllArticles = asyncHandler(async (req, res, next) => {
  const articles = await Article.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: articles.length, data: articles });
});

/**
 * @desc    Get a single article by ID
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticleById = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate('author', 'name email');

  if (!article) {
    return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: article });
});

/**
 * @desc    Create an article
 * @route   POST /api/articles
 * @access  Private/Admin
 */
const createArticle = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/articles/${req.file.filename}` : undefined;

  const article = await Article.create({
    title,
    content,
    image,
    author: req.user.id,
  });

  res.status(201).json({ success: true, data: article });
});

/**
 * @desc    Update an article
 * @route   PUT /api/articles/:id
 * @access  Private/Admin
 */
const updateArticle = asyncHandler(async (req, res, next) => {
  let article = await Article.findById(req.params.id);
  if (!article) {
    return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
  }

  const updates = { ...req.body };

  if (req.file) {
    removeImageFile(article.image);
    updates.image = `/uploads/articles/${req.file.filename}`;
  }

  article = await Article.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: article });
});

/**
 * @desc    Delete an article
 * @route   DELETE /api/articles/:id
 * @access  Private/Admin
 */
const deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
  }

  removeImageFile(article.image);
  await article.deleteOne();

  res.status(200).json({ success: true, message: 'Article deleted successfully' });
});

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
