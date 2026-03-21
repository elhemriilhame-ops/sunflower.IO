const Pepiniere = require('../models/Pepiniere');
const User      = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// ─── User: Apply to become a Pepiniere owner ──────────────────────────────────

/**
 * @desc    Submit a pepiniere application
 * @route   POST /api/pepinieres/apply
 * @access  Private
 */
const applyForPepiniere = asyncHandler(async (req, res, next) => {
  const { proprietaryName, location, email, phone } = req.body;

  const certificates = req.files
    ? req.files.map((file) => `/uploads/certificates/${file.filename}`)
    : [];

  // Prevent duplicate applications
  const existing = await Pepiniere.findOne({ userId: req.user.id });
  if (existing) {
    return next(new ErrorResponse('You have already submitted an application', 400));
  }

  const pepiniere = await Pepiniere.create({
    userId: req.user.id,
    proprietaryName,
    location,
    email,
    phone,
    certificates,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully. Awaiting admin review.',
    data:    pepiniere,
  });
});

/**
 * @desc    Get the current user's application status
 * @route   GET /api/pepinieres/my-application
 * @access  Private
 */
const getMyApplication = asyncHandler(async (req, res, next) => {
  const pepiniere = await Pepiniere.findOne({ userId: req.user.id });

  if (!pepiniere) {
    return next(new ErrorResponse('No application found for this user', 404));
  }

  res.status(200).json({ success: true, data: pepiniere });
});

// ─── Admin: Manage Applications ───────────────────────────────────────────────

/**
 * @desc    Get all pepiniere applications
 * @route   GET /api/pepinieres
 * @access  Private / Admin
 */
const getAllApplications = asyncHandler(async (req, res, next) => {
  const filter = req.query.status ? { status: req.query.status } : {};

  const pepinieres = await Pepiniere.find(filter)
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count:   pepinieres.length,
    data:    pepinieres,
  });
});

/**
 * @desc    Get a single application by ID
 * @route   GET /api/pepinieres/:id
 * @access  Private / Admin
 */
const getApplicationById = asyncHandler(async (req, res, next) => {
  const pepiniere = await Pepiniere.findById(req.params.id).populate(
    'userId',
    'name email phone role'
  );

  if (!pepiniere) {
    return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: pepiniere });
});

/**
 * @desc    Approve a pepiniere application
 * @route   PATCH /api/pepinieres/:id/approve
 * @access  Private / Admin
 */
const approveApplication = asyncHandler(async (req, res, next) => {
  let pepiniere = await Pepiniere.findById(req.params.id);

  if (!pepiniere) {
    return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
  }

  if (pepiniere.status === 'approved') {
    return next(new ErrorResponse('Application is already approved', 400));
  }

  // Approve
  pepiniere.status = 'approved';
  await pepiniere.save();

  // Upgrade role
  await User.findByIdAndUpdate(pepiniere.userId, { role: 'pepiniere_owner' });

  res.status(200).json({
    success: true,
    message: 'Application approved. User role updated to pepiniere_owner.',
    data:    pepiniere,
  });
});

/**
 * @desc    Reject a pepiniere application
 * @route   PATCH /api/pepinieres/:id/reject
 * @access  Private / Admin
 */
const rejectApplication = asyncHandler(async (req, res, next) => {
  let pepiniere = await Pepiniere.findById(req.params.id);

  if (!pepiniere) {
    return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
  }

  if (pepiniere.status === 'rejected') {
    return next(new ErrorResponse('Application is already rejected', 400));
  }

  pepiniere.status = 'rejected';
  await pepiniere.save();

  res.status(200).json({
    success: true,
    message: 'Application rejected.',
    data:    pepiniere,
  });
});

module.exports = {
  applyForPepiniere,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
};
