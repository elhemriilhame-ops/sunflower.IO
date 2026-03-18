const User = require('../models/User');

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Generate a JWT, attach it to a cookie, and send the response.
 * @param {import('mongoose').Document} user
 * @param {number}                      statusCode
 * @param {import('express').Response}  res
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Cookie options
  const cookieOptions = {
    expires:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,                                              // not accessible via JS
    secure:   process.env.NODE_ENV === 'production',            // HTTPS only in prod
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
    }

    // Create user (password is hashed by the pre-save hook in the model)
    const user = await User.create({ name, email, password, phone, role });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Find user and explicitly include the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get currently logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Logout user (clear cookie)
 * @route   GET /api/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
  res
    .status(200)
    .cookie('token', 'none', {
      expires:  new Date(Date.now() + 10 * 1000), // expires in 10 s
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
};

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = { register, login, getMe, logout };
