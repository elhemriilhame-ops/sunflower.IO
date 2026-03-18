const mongoose = require('mongoose');

// ─── Schema ──────────────────────────────────────────────────────────────────

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Please add a product name'],
      trim:     true,
    },

    description: {
      type:     String,
      required: [true, 'Please add a description'],
    },

    price: {
      type:     Number,
      required: [true, 'Please add a price'],
      min:      [0, 'Price cannot be negative'],
    },

    stock: {
      type:    Number,
      default: 0,
      min:     [0, 'Stock cannot be negative'],
    },

    // File path or URL for the product image
    image: {
      type: String,
    },

    pepiniereId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Pepiniere',
      required: [true, 'Please provide a pepiniere ID'],
    },
  },
  { timestamps: true }
);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = mongoose.model('Product', productSchema);
