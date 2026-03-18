const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ─── Storage Configuration ────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/articles');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `article-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ─── File Filter ─────────────────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext     = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
