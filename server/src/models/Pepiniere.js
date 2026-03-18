const mongoose = require('mongoose');

// ─── Schema ──────────────────────────────────────────────────────────────────

const pepiniereSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Please provide a user ID'],
    },

    proprietaryName: {
      type:     String,
      required: [true, 'Please add the owner name'],
      trim:     true,
    },

    location: {
      type:     String,
      required: [true, 'Please add a location'],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, 'Please add an email'],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },

    phone: {
      type:     String,
      required: [true, 'Please add a phone number'],
      trim:     true,
    },

    // Array of certificate file paths / URLs
    certificates: {
      type:    [String],
      default: [],
    },

    status: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = mongoose.model('Pepiniere', pepiniereSchema);
