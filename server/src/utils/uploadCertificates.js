const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ─── Storage Configuration ────────────────────────────────────────────────────

const storage = multer.diskStorage({
  /**
   * Save certificates to /uploads/certificates/
   * The folder is created automatically if it doesn't exist.
   */
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/certificates');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  /**
   * Filename: fieldname-<timestamp>.<ext>
   * e.g.  certificates-1710724800000.pdf
   */
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ─── File Filter ─────────────────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext     = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'), false);
  }
};

// ─── Multer Instance ─────────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,   // 5 MB per file
    files:    5,                  // maximum 5 certificates
  },
});

module.exports = upload;
