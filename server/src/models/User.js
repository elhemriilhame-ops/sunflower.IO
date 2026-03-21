const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

// ─── Schema ──────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Please add a name'],
      trim:     true,
    },

    email: {
      type:     String,
      required: [true, 'Please add an email'],
      unique:   true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },

    password: {
      type:      String,
      required:  [true, 'Please add a password'],
      minlength: 6,
      select:    false,
    },

    phone: {
      type:  String,
      trim:  true,
    },

    role: {
      type:    String,
      enum:    ['admin', 'user', 'client', 'delivery', 'pepiniere_owner'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// ─── Hooks ───────────────────────────────────────────────────────────────────

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Methods ─────────────────────────────────────────────────────────────────

// Return signed JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = mongoose.model('User', userSchema);
