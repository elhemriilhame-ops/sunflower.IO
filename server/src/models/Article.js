const mongoose = require('mongoose');

// ─── Schema ──────────────────────────────────────────────────────────────────

const articleSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Please add a title'],
      trim:     true,
    },

    content: {
      type:     String,
      required: [true, 'Please add content'],
    },

    // File path or URL for the article cover image
    image: {
      type: String,
    },

    // Reference to the User who authored the article
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Please provide an author'],
    },
  },
  { timestamps: true }
);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = mongoose.model('Article', articleSchema);
