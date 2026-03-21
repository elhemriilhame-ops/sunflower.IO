const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect }                         = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validate');

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────────────

router.post('/register', registerValidation, register);
router.post('/login',    loginValidation, login);

// ─── Protected Routes ────────────────────────────────────────────────────────

router.get('/me',     protect, getMe);
router.get('/logout', protect, logout);

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = router;
