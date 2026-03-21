const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware to check validation results and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return next(new ErrorResponse(message, 400));
  }
  next();
};

/**
 * Validation rules for registration
 */
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  validate
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Validation rules for Pepiniere application
 */
const pepiniereValidation = [
  body('proprietaryName').notEmpty().withMessage('Proprietary name is required').trim(),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required'),
  validate
];

/**
 * Validation rules for Products
 */
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required').trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validate
];

/**
 * Validation rules for Articles
 */
const articleValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('content').notEmpty().withMessage('Content is required'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  pepiniereValidation,
  productValidation,
  articleValidation
};
