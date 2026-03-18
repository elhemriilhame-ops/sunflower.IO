const Article = require('../models/Article');
const fs      = require('fs');
const path    = require('path');

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
 * @desc    Get a single article by ID
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create an article
 * @route   POST /api/articles
 * @access  Private/Admin
 */
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/articles/${req.file.filename}` : undefined;

    const article = await Article.create({
      title,
      content,
      image,
      author: req.user.id,
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an article
 * @route   PUT /api/articles/:id
 * @access  Private/Admin
 */
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const { title, content } = req.body;
    const updates = { title, content };

    if (req.file) {
      removeImageFile(article.image);
      updates.image = `/uploads/articles/${req.file.filename}`;
    }

    const updated = await Article.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an article
 * @route   DELETE /api/articles/:id
 * @access  Private/Admin
 */
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    removeImageFile(article.image);
    await article.deleteOne();

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
