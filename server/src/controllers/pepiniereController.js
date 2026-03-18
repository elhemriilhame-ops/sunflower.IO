const Pepiniere = require('../models/Pepiniere');
const User      = require('../models/User');

// ─── User: Apply to become a Pepiniere owner ──────────────────────────────────

/**
 * @desc    Submit a pepiniere application
 * @route   POST /api/pepinieres/apply
 * @access  Private (any authenticated user)
 */
const applyForPepiniere = async (req, res) => {
  try {
    const { proprietaryName, location, email, phone } = req.body;

    // Collect uploaded certificate file paths (relative URLs for serving)
    const certificates = req.files
      ? req.files.map((file) => `/uploads/certificates/${file.filename}`)
      : [];

    // Prevent duplicate applications from the same user
    const existing = await Pepiniere.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application',
      });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get the current user's application status
 * @route   GET /api/pepinieres/my-application
 * @access  Private
 */
const getMyApplication = async (req, res) => {
  try {
    const pepiniere = await Pepiniere.findOne({ userId: req.user.id });

    if (!pepiniere) {
      return res.status(404).json({
        success: false,
        message: 'No application found for this user',
      });
    }

    res.status(200).json({ success: true, data: pepiniere });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: Manage Applications ───────────────────────────────────────────────

/**
 * @desc    Get all pepiniere applications
 * @route   GET /api/pepinieres
 * @access  Private / Admin
 */
const getAllApplications = async (req, res) => {
  try {
    // Optional status filter: /api/pepinieres?status=pending
    const filter = req.query.status ? { status: req.query.status } : {};

    const pepinieres = await Pepiniere.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   pepinieres.length,
      data:    pepinieres,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get a single application by ID
 * @route   GET /api/pepinieres/:id
 * @access  Private / Admin
 */
const getApplicationById = async (req, res) => {
  try {
    const pepiniere = await Pepiniere.findById(req.params.id).populate(
      'userId',
      'name email phone role'
    );

    if (!pepiniere) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, data: pepiniere });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Approve a pepiniere application
 *          → sets application status to "approved"
 *          → upgrades the applicant's role to "pepiniere_owner"
 * @route   PATCH /api/pepinieres/:id/approve
 * @access  Private / Admin
 */
const approveApplication = async (req, res) => {
  try {
    const pepiniere = await Pepiniere.findById(req.params.id);

    if (!pepiniere) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (pepiniere.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Application is already approved' });
    }

    // 1. Approve the application
    pepiniere.status = 'approved';
    await pepiniere.save();

    // 2. Upgrade the user's role
    await User.findByIdAndUpdate(pepiniere.userId, { role: 'pepiniere_owner' });

    res.status(200).json({
      success: true,
      message: 'Application approved. User role updated to pepiniere_owner.',
      data:    pepiniere,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject a pepiniere application
 * @route   PATCH /api/pepinieres/:id/reject
 * @access  Private / Admin
 */
const rejectApplication = async (req, res) => {
  try {
    const pepiniere = await Pepiniere.findById(req.params.id);

    if (!pepiniere) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (pepiniere.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Application is already rejected' });
    }

    pepiniere.status = 'rejected';
    await pepiniere.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected.',
      data:    pepiniere,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Export ──────────────────────────────────────────────────────────────────

module.exports = {
  applyForPepiniere,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
};
